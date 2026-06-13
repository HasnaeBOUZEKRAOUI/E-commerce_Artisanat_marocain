// src/components/home/ProductsSection.jsx
import { useState, useEffect } from 'react'
import { Link }           from 'react-router-dom'
import ProductCard        from './ProductCard'
import { useCartContext } from '../../context/CartContext'
import { produitsApi }    from '../../api/services'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-square bg-gray-100 rounded animate-pulse" />
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
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
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-100">
        <h2 className="font-manuale text-3xl md:text-4xl font-bold uppercase tracking-tight text-black">
          {title}
        </h2>
        <Link
          to={`/categories/${slug}`}
          className="font-manrope text-[13px] text-gray-900 hover:text-amber-700 font-medium flex items-center gap-1"
        >
          Voir plus →
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <p className="text-sm text-red-400 py-4">Erreur de chargement.</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">Aucun produit trouvé pour cette section.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              img={product.image_url}
              description={product.nom}
              price={`${product.prix} dh`}
              onAdd={() => addItem({
                id:        product.id,
                name:      product.nom,
                image_url: product.image_url,
                price:     product.prix,
              })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── IMPORTANT : ces slugs doivent correspondre exactement ──
// aux slugs dans ta table `categories`
// Lance : SELECT nom, slug FROM categories WHERE niveau=3 LIMIT 20;
// pour voir les vrais slugs importés
const SECTIONS = [
  {
    key:    'nouveautes',
    title:  'Nouveautés',
    slug:   'tapis',           // slug catégorie niveau 3 importée
    params: { sort: 'newest', per_page: 6 },
  },
  {
    key:    'tapis',
    title:  'Tapis Berbères',
    slug:   'tapis',
    params: { category: 'tapis', per_page: 6 },
  },
  {
    key:    'bijoux',
    title:  'Bijoux',
    slug:   'bijoux-femme',
    params: { category: 'bijoux-femme', per_page: 6 },
  },
  {
    key:    'gastronomie',
    title:  'Goût du Maroc',
    slug:   'culinary-oils',
    params: { category: 'culinary-oils', per_page: 6 },
  },
]

export default function ProductsSection() {
  const initial = Object.fromEntries(
    SECTIONS.map(({ key }) => [key, { products: [], loading: true, error: false }])
  )
  const [sections, setSections] = useState(initial)

  useEffect(() => {
    SECTIONS.forEach(({ key, params }) => {
      produitsApi.list(params)
        .then((res) => {
          // Laravel paginate → res.data = { data: [...], meta: {...} }
          const raw      = res.data
          const products = raw?.data ?? raw ?? []
          setSections((prev) => ({
            ...prev,
            [key]: {
              products: Array.isArray(products) ? products : [],
              loading: false,
              error: false,
            },
          }))
        })
        .catch(() => {
          setSections((prev) => ({
            ...prev,
            [key]: { products: [], loading: false, error: true },
          }))
        })
    })
  }, [])

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {SECTIONS.map(({ key, title, slug }) => (
          <ProductGrid key={key} title={title} slug={slug} {...sections[key]} />
        ))}
      </div>
    </section>
  )
}