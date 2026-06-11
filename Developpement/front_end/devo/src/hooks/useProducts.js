// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { produitsApi } from '../api/services'

/**
 * Hook useProducts
 *
 * Usage :
 *   const { products, meta, loading, error, setFilters, setPage } =
 *     useProducts({ category: 'tapis', per_page: 20 });
 *
 * La réponse Laravel attendue :
 *   { data: [...], meta: { current_page, last_page, total, per_page }, links: {...} }
 */
export default function useProducts(initialParams = {}) {
  const [params, setParams]     = useState({ page: 1, per_page: 20, ...initialParams })
  const [products, setProducts] = useState([])
  const [meta, setMeta]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await produitsApi.list(params)
      // Laravel paginate() → { data, meta, links }
      setProducts(res.data.data ?? res.data)
      setMeta(res.data.meta ?? null)
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setFilters = useCallback((newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const resetFilters = useCallback(() => {
    setParams({ page: 1, per_page: 20, ...initialParams })
  }, [JSON.stringify(initialParams)])

  return { products, meta, loading, error, params, setFilters, setPage, resetFilters }
}