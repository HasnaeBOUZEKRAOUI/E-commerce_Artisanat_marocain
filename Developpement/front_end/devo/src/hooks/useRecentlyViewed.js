// src/hooks/useRecentlyViewed.js
import { useState, useEffect } from 'react'
import { recentlyViewedApi } from '../api/services'

const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS   = 10

export default function useRecentlyViewed() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const ids = getStoredIds()
    if (!ids.length) return

    setLoading(true)
    recentlyViewedApi.get(ids)
      .then((res) => setProducts(res.data.data ?? res.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  /** Enregistre un produit consulté */
  const addProduct = (productId) => {
    const ids     = getStoredIds().filter((id) => id !== productId)
    const updated = [productId, ...ids].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { products, loading, addProduct }
}

function getStoredIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}