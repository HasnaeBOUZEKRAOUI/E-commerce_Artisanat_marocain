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
  list:   (params) => api.get('/produits', { params }),
  get:    (id)     => api.get(`/produits/${id}`),
  recommandations: (id)     => api.get(`/produits/${id}/recommandations`), 
}


export const categoriesApi = {
  menu:          ()     => api.get('/categories/menu'),  
  populaires: (limit) => api.get('/categories/populaires', { params: { limit } }),  
  list:          ()     => api.get('/categories'),
  subcategories: (slug) => api.get(`/categories/${slug}/subcategories`),
}


export const recentlyViewedApi = {
  get: (ids) => api.post('/produits/recently-viewed', { ids }),
}

// ── Artisans ─────────────────────────────────────────────────
export const artisansApi = {
  list:     (params) => api.get('/artisans', { params }),
  featured: ()        => api.get('/artisans/featured'),
  get:      (id)      => api.get(`/artisans/${id}`),
}

export const paypalApi = {

  createOrder:      (data)    => api.post('/orders/create', data),
  captureOrder:     (orderId) => api.post(`/orders/${orderId}/capture`),
}

// ── Avis ──────────────────────────────────────────────────────────────────────
export const avisApi = {
  liste:            (produitId)          => api.get(`/produits/${produitId}/avis`),
  creer:            (produitId, data)    => api.post(`/produits/${produitId}/avis`, data),
  supprimer:        (avisId)             => api.delete(`/avis/${avisId}`),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
  // GET /api/notifications  (token requis)
  liste:            ()        => api.get('/notifications'),

  // PUT /api/notifications/{id}/lue  (token requis)
  marquerLue:       (id)      => api.put(`/notifications/${id}/lue`),

  // DELETE /api/notifications/{id}  (token requis)
  supprimer:        (id)      => api.delete(`/notifications/${id}`),
}

// ── Profil utilisateur ────────────────────────────────────────────────────────
export const profilApi = {
  get:              ()        => api.get('/user/profil'),

  update:           (data)    => api.put('/user/profil/update', data),

  }


export const commandesApi = {
  liste:            (params)  => api.get('/commandes', { params }),
  get:              (id)      => api.get(`/commandes/${id}`),
  creer:            (data)    => api.post('/commandes', data),
}