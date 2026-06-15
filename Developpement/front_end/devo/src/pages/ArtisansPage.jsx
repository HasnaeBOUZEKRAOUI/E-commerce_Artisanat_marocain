// src/pages/ArtisansPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { artisansApi } from '../api/services'
import Pagination from '../components/ui/Pagination'

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState([])
  const [meta, setMeta]         = useState(null)
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    artisansApi.list({ page, per_page: 12 })
      .then((res) => {
        const data = res.data
        setArtisans(data.data ?? [])
        setMeta({
          current_page: data.current_page ?? 1,
          last_page:    data.last_page ?? 1,
          total:        data.total ?? 0,
        })
      })
      .catch(() => setArtisans([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">

        <div className="mb-10 border-b border-gray-100 pb-6">
          <p className="font-manrope text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-2">
            Nos partenaires
          </p>
          <h1 className="font-manrope text-4xl font-[900] uppercase text-black tracking-tighter">
            Tous les Artisans
          </h1>
          {meta && <p className="text-sm text-gray-500 mt-2">{meta.total} boutiques</p>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : artisans.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Aucun artisan trouvé.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {artisans.map((artisan) => (
              <Link
                key={artisan.id}
                to={`/artisans/${artisan.id}`}
                className="flex flex-col group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                  {artisan.image_url ? (
                    <img
                      src={artisan.image_url}
                      alt={artisan.boutique}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xl uppercase">
                      {artisan.boutique?.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-manrope text-[14px] font-bold uppercase tracking-widest text-black group-hover:text-amber-700 transition-colors">
                  {artisan.boutique}
                </h3>
                <p className="text-[12px] text-gray-400 mt-1">{artisan.nb_produits} produits</p>
              </Link>
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