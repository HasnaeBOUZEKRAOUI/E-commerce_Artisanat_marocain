// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { produitsApi } from '../api/services'

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
      const res  = await produitsApi.list(params)
      const data = res.data

      // Laravel paginate() renvoie data + current_page/last_page/total À LA RACINE
      setProducts(data.data ?? [])
      setMeta({
        current_page: data.current_page ?? 1,
        last_page:    data.last_page ?? 1,
        total:        data.total ?? 0,
        per_page:     data.per_page ?? params.per_page,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setFilters = useCallback((newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }))
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