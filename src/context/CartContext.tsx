"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Variation } from "@/components/ProductModal";

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  variation: Variation;
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  uf: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variation: Variation, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customerData: CustomerData | null;
  saveCustomerData: (data: CustomerData) => void;
}

const defaultContext: CartContextType = {
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

const CartContext = createContext<CartContextType>(defaultContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nyatelie_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedCustomer = localStorage.getItem("nyatelie_customer");
      if (savedCustomer) setCustomerData(JSON.parse(savedCustomer));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Salvar alterações de carrinho
  useEffect(() => {
    try {
      localStorage.setItem("nyatelie_cart", JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const saveCustomerData = (data: CustomerData) => {
    setCustomerData(data);
    try {
      localStorage.setItem("nyatelie_customer", JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
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
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        customerData,
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
