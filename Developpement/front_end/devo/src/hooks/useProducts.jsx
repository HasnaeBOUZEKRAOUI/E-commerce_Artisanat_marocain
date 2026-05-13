import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/api";

/**
 * Hook useProducts
 *
 * Usage :
 *   const { products, meta, loading, error, setFilters, setPage } =
 *     useProducts({ category: "salon-chambre", per_page: 20 });
 */
export default function useProducts(initialParams = {}) {
  const [params, setParams] = useState({ page: 1, per_page: 20, ...initialParams });
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);   // { current_page, last_page, total, per_page }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(params);
      // Laravel paginate() renvoie { data, meta, links }
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** Mettre à jour un ou plusieurs filtres et revenir à la page 1 */
  const setFilters = useCallback((newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  /** Changer de page */
  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /** Réinitialiser tous les filtres */
  const resetFilters = useCallback(() => {
    setParams({ page: 1, per_page: 20, ...initialParams });
  }, [initialParams]);

  return { products, meta, loading, error, params, setFilters, setPage, resetFilters };
}