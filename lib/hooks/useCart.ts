"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "retroase_cart_v1";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  slug: string;
};

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setIsLoaded(true);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev;
      const next = [...prev, item];
      writeStorage(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    isLoaded,
    count: items.length,
    total,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
}
