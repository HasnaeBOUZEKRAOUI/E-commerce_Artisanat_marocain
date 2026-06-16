// src/components/home/ProductsSection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { useCartContext } from '../../context/CartContext'
import { produitsApi } from '../../api/services'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-square bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  )
}

function ProductGrid({ title, slug, products, loading, error }) {
  const { addItem } = useCartContext()

  return (
    <div className="mb-16">
      {/* En-tête de section */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-100">
        <h2 className="font-manuale text-2xl md:text-3xl font-bold uppercase tracking-tight text-black">
          {title}
        </h2>
        <Link
          to={slug ? `/categories/${slug}` : '/boutique'}
          className="font-manrope text-sm text-gray-900 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors"
        >
          Voir plus →
        </Link>
      </div>

      {/* États de chargement / Erreurs / Affichage */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <p className="text-sm text-red-500 py-4 font-medium">⚠️ Erreur lors du chargement des produits.</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">Aucun produit disponible dans cette section pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/produits/${product.id}`} 
              className="group block"
            >
            <ProductCard
              key={product.id}
              img={product.image_url}
              description={product.nom}
              // Affiche le prix calculé par Laravel
              price={`${product.prix} MAD`} 
              onAdd={() => addItem({
                id: product.id,
                name: product.nom,
                image_url: product.image_url,
                price: product.prix, // Envoie le prix remisé (actuel) au panier
              })}
            />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
const SECTIONS = [
  {
    key: 'nouveautes',
    title: 'Nouveautés',
    slug: '', 
    params: { sort: 'newest', per_page: 6 },
  },
  {
    key: 'tapis',
    title: 'Tapis Berbères',
    slug: 'moroccan-rugs', 
    params: { category: 'moroccan-rugs', per_page: 6 },
  },
  {
    key: 'bijoux',
    title: 'Bijoux pour Elle',
    // Cible le Niveau 2 complet de la branche JEWELRY pour avoir bagues, colliers, bracelets, etc.
    slug: 'jewelry-women', 
    params: { category: 'jewelry-women', per_page: 6 },
  },
 
  {
    key: 'gastronomie',
    title: 'Goût du Maroc',
    slug: 'HONEY',
    params: { category: 'HONEY', per_page: 6 }, // 👈 Vos bouteilles d'huiles iront ici !
  },
  {
    key: 'cosmetique',
    title: 'Soin & Beauté',
    slug: 'body-care',
    params: { category: 'body-care', per_page: 6 }, // 👈 Pour l'huile cosmétique (Argan Oil sérum)
  },
]

export default function ProductsSection() {
  // Génère dynamiquement l'état initial pour éviter les répétitions de code
  const initial = Object.fromEntries(
    SECTIONS.map(({ key }) => [key, { products: [], loading: true, error: false }])
  )
  const [sections, setSections] = useState(initial)

  useEffect(() => {
    // On lance toutes les requêtes HTTP en parallèle pour de meilleures performances
    SECTIONS.forEach(({ key, params }) => {
      produitsApi.list(params)
        .then((res) => {
          // Gère la pagination de Laravel (res.data.data) ou un tableau brut s'il n'y a pas de pagination
          const dataFromApi = res.data?.data ?? res.data ?? []
          
          setSections((prev) => ({
            ...prev,
            [key]: {
              products: Array.isArray(dataFromApi) ? dataFromApi : [],
              loading: false,
              error: false,
            },
          }))
        })
        .catch((err) => {
          console.error(`Erreur section [${key}]:`, err)
          setSections((prev) => ({
            ...prev,
            [key]: { products: [], loading: false, error: true },
          }))
        })
    })
  }, [])

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {SECTIONS.map(({ key, title, slug }) => (
          <ProductGrid 
            key={key} 
            title={title} 
            slug={slug} 
            {...sections[key]} // Passe products, loading et error comme props
          />
        ))}
      </div>
    </section>
  )
}