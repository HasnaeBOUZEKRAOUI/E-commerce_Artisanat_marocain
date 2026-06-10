import { useState, useEffect, useCallback } from "react";

const CART_KEY = "cart_items";

export default function useCart() {
  const [items, setItems] = useState([]);

  // Load cart
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setItems(stored);
    } catch {
      setItems([]);
    }
  }, []);

  // Sync helper
  const sync = (newItems) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  // Add item
  const addItem = useCallback((product, qty = 1) => {
    sync((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });
  }, []);

  // Update qty
  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;

    sync((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, quantity: qty } : i
      )
    );
  }, []);

  // Remove item
  const removeItem = useCallback((productId) => {
    sync((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => sync([]), []);

  // Derived values
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };
}