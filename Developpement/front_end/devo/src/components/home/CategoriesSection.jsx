// src/components/home/CategoriesSection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoriesApi } from '../../api/services'

// Données de secours si l'API est indisponible
const FALLBACK = [
  { id: 1, nom: 'Bougies',            slug: 'bougies',     image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
  { id: 2, nom: 'Tapis',              slug: 'tapis',       image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: 3, nom: 'Huiles corporelles', slug: 'soins',       image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80' },
  { id: 4, nom: 'Coussins décoratifs',slug: 'decoration',  image_url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80' },
  { id: 5, nom: 'Décoration murale',  slug: 'decoration',  image_url: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=400&q=80' },
  { id: 6, nom: 'Sacs',               slug: 'femmes',      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
]

export default function CategoriesSection() {
  const [categories, setCategories] = useState(FALLBACK)

  useEffect(() => {
    categoriesApi.list()
      .then((res) => {
        const data = res.data.data ?? res.data
        if (data?.length) setCategories(data)
      })
      .catch(() => {}) // Garde les données de secours
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center font-manuale text-3xl md:text-4xl font-semibold text-black mb-14 tracking-tight">
          Catégories Populaires
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 md:gap-x-4">
          {categories.map((cat) => (
            <Link key={cat.id ?? cat.slug} to={`/categories/${cat.slug}`}
              className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-[1.5px] border-gray-200 transition-all duration-500 group-hover:border-black p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src={cat.image_url} alt={cat.nom ?? cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <span className="mt-6 font-manrope text-[13px] md:text-[14px] font-extrabold text-black text-center uppercase tracking-[0.15em] group-hover:text-amber-700 transition-colors">
                {cat.nom ?? cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}