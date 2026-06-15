// src/pages/ArtisanDetailPage.jsx
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { artisansApi } from '../api/services'
import useProducts        from '../hooks/useProducts'
import ProductCard        from '../components/home/ProductCard'
import Pagination         from '../components/ui/Pagination'
import { useCartContext } from '../context/CartContext'

export default function ArtisanDetailPage() {
  const { id } = useParams()
  const { addItem } = useCartContext()

  const [artisan, setArtisan] = useState(null)
  const [loadingArtisan, setLoadingArtisan] = useState(true)
  const [error, setError] = useState(false)

  const { products, meta, loading, setFilters, setPage } = useProducts({
    artisan: id,
    per_page: 16,
  })

  useEffect(() => {
    setLoadingArtisan(true)
    artisansApi.get(id)
      .then((res) => setArtisan(res.data))
      .catch(() => setError(true))
      .finally(() => setLoadingArtisan(false))
  }, [id])

  useEffect(() => {
    setFilters({ artisan: id, page: 1 })
  }, [id])

  if (loadingArtisan) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
          <div className="h-40 bg-gray-100 rounded animate-pulse mb-10" />
        </div>
      </main>
    )
  }

  if (error || !artisan) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 text-center">
          <p className="text-gray-400 mb-4">Artisan introuvable.</p>
          <Link to="/artisans" className="text-sm font-semibold underline">Retour aux artisans</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      {/* En-tête boutique */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0">
            {artisan.image_url ? (
              <img src={artisan.image_url} alt={artisan.boutique} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300 uppercase">
                {artisan.boutique?.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <p className="font-manrope text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-2">
              Boutique Artisanale
            </p>
            <h1 className="font-manrope text-3xl md:text-4xl font-[900] uppercase text-black tracking-tighter mb-2">
              {artisan.boutique}
            </h1>
            {artisan.description && (
              <p className="text-sm text-gray-600 max-w-2xl">{artisan.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">{artisan.nb_produits} produits disponibles</p>
          </div>
        </div>
      </div>

      {/* Produits */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
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
          <p className="text-center text-gray-400 py-20">Cet artisan n'a pas encore de produits.</p>
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