// src/components/home/CategoriesSection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoriesApi } from '../../api/services'

export default function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)

  useEffect(() => {
    categoriesApi.populaires(6)
      .then((res) => {
        // res.data = { data: [...] }
        const data = res.data?.data ?? []
        console.log('Catégories populaires reçues :', data) // ← debug, à retirer après
        setCategories(data)
      })
      .catch((err) => {
        console.error('Erreur categories/populaires :', err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center font-manuale text-3xl md:text-4xl font-semibold text-black mb-14 tracking-tight">
          Catégories Populaires
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 md:gap-x-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 animate-pulse" />
                <div className="mt-6 h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm text-gray-400">
            Impossible de charger les catégories.
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            Aucune catégorie populaire trouvée.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 md:gap-x-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-[1.5px] border-gray-200 transition-all duration-500 group-hover:border-black p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.nom}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        {cat.nom}
                      </div>
                    )}
                  </div>
                </div>
                <span className="mt-6 font-manrope text-[13px] md:text-[14px] font-extrabold text-black text-center uppercase tracking-[0.15em] group-hover:text-amber-700 transition-colors">
                  {cat.nom}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}