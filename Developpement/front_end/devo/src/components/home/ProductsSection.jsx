// src/components/home/ProductsSection.jsx
import { useState, useEffect } from 'react'
import ProductCard           from './ProductCard'
import { useCartContext }    from '../../context/CartContext'
import { produitsApi }       from '../../api/services'

// ── Grille par section ──────────────────────────────────────
function ProductGrid({ title, products, loading }) {
  const { addItem } = useCartContext()

  const handleAddToCart = (product) => {
    addItem({
      id:        product.id,
      name:      product.nom ?? product.name,
      image_url: product.image_url ?? product.img,
      price:     product.prix ?? product.price,
    })
  }

  return (
    <div className="mb-12">
      <div className="flex items-baseline justify-between mb-10 border border-gray-100 pb-4">
        <h2 className="font-manuale text-3xl md:text-4xl font-bold uppercase tracking-tight text-black">
          {title}
        </h2>
        <a href="#" className="font-manrope text-[13px] text-gray-900 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors">
          Voir plus <span className="text-lg">→</span>
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square bg-gray-100 rounded animate-pulse" />
              <div className="h-3 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              img={product.image_url ?? product.img}
              description={product.description}
              price={`${product.prix ?? product.price} dh`}
              onAdd={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Section principale ──────────────────────────────────────
export default function ProductsSection() {
  const [sections, setSections] = useState({
    nouveautes:  { products: [], loading: true },
    tables:      { products: [], loading: true },
    bijoux:      { products: [], loading: true },
    gastronomie: { products: [], loading: true },
  })

  useEffect(() => {
    const configs = [
      { key: 'nouveautes',  params: { sort: 'newest',   per_page: 6 } },
      { key: 'tables',      params: { category: 'decoration', per_page: 6 } },
      { key: 'bijoux',      params: { category: 'bijoux',     per_page: 6 } },
      { key: 'gastronomie', params: { category: 'gastronomie', per_page: 6 } },
    ]

    configs.forEach(({ key, params }) => {
      produitsApi.list(params)
        .then((res) => {
          setSections((prev) => ({
            ...prev,
            [key]: { products: res.data.data ?? res.data ?? [], loading: false },
          }))
        })
        .catch(() => {
          setSections((prev) => ({
            ...prev,
            [key]: { products: [], loading: false },
          }))
        })
    })
  }, [])

  return (
    <section className="py-2 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <ProductGrid title="Nouveautés"              {...sections.nouveautes}  />
        <ProductGrid title="Faites Briller Vos Tables" {...sections.tables}   />
        <ProductGrid title="Bijoux"                  {...sections.bijoux}      />
        <ProductGrid title="Goût du Maroc"           {...sections.gastronomie} />
      </div>
    </section>
  )
}