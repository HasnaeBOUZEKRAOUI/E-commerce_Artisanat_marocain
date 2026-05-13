import { useState, useEffect } from "react";
import { getRecentlyViewed } from "../services/api";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 10;

/**
 * Hook useRecentlyViewed
 * Stocke les IDs consultés en localStorage et fetche les produits correspondants
 */
export default function useRecentlyViewed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les IDs stockés et fetcher les produits
  useEffect(() => {
    const ids = getStoredIds();
    if (!ids.length) return;

    setLoading(true);
    getRecentlyViewed(ids)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  /** Ajouter un produit aux récemment consultés */
  const addProduct = (productId) => {
    const ids = getStoredIds().filter((id) => id !== productId);
    const updated = [productId, ...ids].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { products, loading, addProduct };
}

function getStoredIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}