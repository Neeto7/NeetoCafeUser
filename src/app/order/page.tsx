"use client";

import { useState } from "react";
import type { Menu } from "@/types/Menu";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Menu) => {
    setCart(prev => {
      const found = prev.find(c => c.id === item.id);
      if (found) {
        return prev.map(c =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (item: Menu) => {
    setCart(prev => {
      const found = prev.find(c => c.id === item.id);
      if (!found) return prev;
      if (found.qty === 1) return prev.filter(c => c.id !== item.id);
      return prev.map(c =>
        c.id === item.id ? { ...c, qty: c.qty - 1 } : c
      );
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return { cart, addToCart, removeFromCart, total };
};
