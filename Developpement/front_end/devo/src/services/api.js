// ============================================================
//  API Service – connecté à Laravel backend
//  Base URL : définie dans .env → VITE_API_URL=http://localhost:8000/api
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Wrapper fetch générique avec gestion d'erreur
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token"); // JWT si auth

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ──────────────────────────────────────────────
//  CATÉGORIES
// ──────────────────────────────────────────────

/**
 * GET /api/categories
 * Retourne toutes les catégories parentes
 */
export const getCategories = () => apiFetch("/categories");

/**
 * GET /api/categories/{slug}/subcategories
 * Retourne les sous-catégories d'une catégorie
 */
export const getSubcategories = (categorySlug) =>
  apiFetch(`/categories/${categorySlug}/subcategories`);

// ──────────────────────────────────────────────
//  PRODUITS
// ──────────────────────────────────────────────

/**
 * GET /api/products
 * Paramètres supportés par Laravel :
 *  - category      : slug catégorie
 *  - subcategory   : slug sous-catégorie
 *  - page          : numéro de page (pagination Laravel)
 *  - per_page      : produits par page (défaut 20)
 *  - sort          : newest | price_asc | price_desc | popular
 *  - disponibilite : all | in_stock | out_of_stock
 *  - prix_min      : number
 *  - prix_max      : number
 *  - couleur       : string (ex: rouge,bleu)
 *  - taille        : string
 *
 * Réponse Laravel paginée attendue :
 * {
 *   data: Product[],
 *   meta: { current_page, last_page, per_page, total },
 *   links: { first, last, prev, next }
 * }
 */
export const getProducts = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      query.set(key, val);
    }
  });
  return apiFetch(`/products?${query.toString()}`);
};

/**
 * GET /api/products/{id}
 * Détail d'un produit
 */
export const getProduct = (id) => apiFetch(`/products/${id}`);

/**
 * GET /api/products/recently-viewed
 * Récemment consultés (IDs stockés en localStorage)
 */
export const getRecentlyViewed = (ids = []) => {
  if (!ids.length) return Promise.resolve({ data: [] });
  return apiFetch(`/products/recently-viewed?ids=${ids.join(",")}`);
};