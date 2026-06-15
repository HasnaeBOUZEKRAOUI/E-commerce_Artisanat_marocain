// src/pages/StylePage.jsx
import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import useProducts          from '../hooks/useProducts'
import ProductCard           from '../components/home/ProductCard'
import Pagination            from '../components/ui/Pagination'
import { useCartContext }    from '../context/CartContext'

const STYLE_LABELS = {
  moderne:      'Modern',
  traditionnel: 'Tradition',
}

export default function StylePage() {
  const { styleSlug } = useParams() // 'moderne' ou 'traditionnel'
  const { addItem }   = useCartContext()

  const { products, meta, loading, setFilters, setPage } = useProducts({
    style: styleSlug,
    per_page: 24,
  })

  // Recharge si l'utilisateur change de style sans recharger la page
  useEffect(() => {
    setFilters({ style: styleSlug, page: 1 })
  }, [styleSlug])

  const label = STYLE_LABELS[styleSlug] ?? styleSlug

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">

        {/* En-tête */}
        <div className="mb-10 border-b border-gray-100 pb-6">
          <p className="font-manrope text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-2">
            Shop par style
          </p>
          <h1 className="font-manrope text-4xl font-[900] uppercase text-black tracking-tighter">
            {label}
          </h1>
          {meta && (
            <p className="text-sm text-gray-500 mt-2">{meta.total} produits</p>
          )}
        </div>

        {/* Grille produits */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Aucun produit trouvé pour ce style.</p>
            <Link to="/" className="text-sm font-semibold underline">Retour à l'accueil</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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

        {/* Pagination */}
        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  )
}