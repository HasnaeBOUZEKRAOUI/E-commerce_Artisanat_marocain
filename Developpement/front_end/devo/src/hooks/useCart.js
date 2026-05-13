import { useState, useEffect, useCallback } from "react";

const CART_KEY = "cart_items";

/**
 * useCart – gestion complète du panier
 * Persisté en localStorage, synchronisé avec le backend au checkout
 */
export default function useCart() {
  const [items, setItems] = useState([]);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setItems(stored);
    } catch {
      setItems([]);
    }
  }, []);

  // Sauvegarder à chaque modification
  const save = (newItems) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  /** Ajouter un produit (ou incrémenter si déjà présent) */
  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...product, quantity: qty }];
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /** Modifier la quantité d'un article */
  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setItems((prev) => {
      const updated = prev.map((i) => i.id === productId ? { ...i, quantity: qty } : i);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /** Supprimer un article */
  const removeItem = useCallback((productId) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== productId);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /** Vider le panier */
  const clearCart = useCallback(() => save([]), []);

  // Calculs dérivés
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, totalItems, totalPrice, addItem, updateQty, removeItem, clearCart };
}