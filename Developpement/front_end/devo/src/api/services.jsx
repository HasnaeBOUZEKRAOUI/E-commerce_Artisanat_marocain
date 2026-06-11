// src/api/services.js
import api from './axios'

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login:    (data)   => api.post('/login', data),
  register: (data)   => api.post('/register', data),
  logout:   ()       => api.post('/logout'),
  me:       ()       => api.get('/me'),
}

// ── Produits ─────────────────────────────────────────────────
export const produitsApi = {
  // GET /api/produits?category=tapis&subcategory=...&page=1&per_page=20
  list:   (params) => api.get('/produits', { params }),
  get:    (id)     => api.get(`/produits/${id}`),
}

// ── Catégories ───────────────────────────────────────────────
export const categoriesApi = {
  list:          ()     => api.get('/categories'),
  subcategories: (slug) => api.get(`/categories/${slug}/subcategories`),
}

// ── Panier / Commandes ───────────────────────────────────────
export const commandesApi = {
  creer: (data) => api.post('/commandes', data),
  // data = { items: [{product_id, quantity, price}], adresse_livraison, note, total }
}

// ── Produits récemment consultés ─────────────────────────────
export const recentlyViewedApi = {
  // POST ids[] → Laravel renvoie les produits correspondants
  get: (ids) => api.post('/produits/recently-viewed', { ids }),
}

// ── Artisans ─────────────────────────────────────────────────
export const artisansApi = {
  featured: () => api.get('/artisans/featured'),
  get:      (id) => api.get(`/artisans/${id}`),
}