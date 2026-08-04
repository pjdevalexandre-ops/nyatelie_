"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  size: string;
  price: number;
  quantity: number;
  observations?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nyatelie_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar carrinho:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nyatelie_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Erro ao salvar carrinho:", e);
    }
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        if (newItem.observations) {
          updated[existingIndex].observations = newItem.observations;
        }
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Retorno fallback seguro caso algum componente renderize fora do Provider (ex: telas puras de login)
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      totalItems: 0,
      totalPrice: 0,
    };
  }
  return context;
}
