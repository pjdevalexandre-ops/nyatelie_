"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Variation } from "@/components/ProductModal";

export interface CartItem {
  id: string;
  product: Product;
  variation: Variation;
  quantity: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  uf: string;
  role: "customer" | "admin";
}

// Alias para compatibilidade
export type CustomerData = UserProfile;

interface AuthContextType {
  user: UserProfile | null;
  login: (phone: string, name?: string, address?: Partial<UserProfile>) => void;
  logout: () => void;
  items: CartItem[];
  addItem: (product: Product, variation: Variation, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customerData: UserProfile | null;
  saveCustomerData: (data: UserProfile) => void;
}

const defaultContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  customerData: null,
  saveCustomerData: () => {},
};

const CartContext = createContext<AuthContextType>(defaultContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("nyatelie_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedCart = localStorage.getItem("nyatelie_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // Ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        localStorage.setItem("nyatelie_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("nyatelie_user");
      }
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("nyatelie_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const login = (phone: string, name?: string, address?: Partial<UserProfile>) => {
    const isAdmin = phone.replace(/\D/g, "") === "91984829252" || name?.toLowerCase().includes("admin");
    const newUser: UserProfile = {
      name: name || (isAdmin ? "Administrador" : "Cliente NyAtelie"),
      phone,
      cep: address?.cep || "",
      street: address?.street || "",
      number: address?.number || "",
      complement: address?.complement || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "São Miguel do Guamá",
      uf: address?.uf || "PA",
      role: isAdmin ? "admin" : (address?.role || "customer"),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nyatelie_user");
  };

  const saveCustomerData = (data: UserProfile) => {
    setUser(data);
  };

  const addItem = (product: Product, variation: Variation, quantity = 1) => {
    setItems((prev) => {
      const cartItemId = `${product.id}-${variation.id || variation.size}`;
      const existing = prev.find((item) => item.id === cartItemId);

      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { id: cartItemId, product, variation, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.variation.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        user,
        login,
        logout,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        customerData: user,
        saveCustomerData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
