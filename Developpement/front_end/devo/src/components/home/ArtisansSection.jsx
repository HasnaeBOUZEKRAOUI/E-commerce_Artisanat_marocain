// src/components/home/ArtisansSection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { artisansApi } from '../../api/services'
import imgCosmetic from '../../assets/images/artisan1.png'
import imgSafia    from '../../assets/images/artisan2.png'
import imgDarLhna  from '../../assets/images/artisan3.png'

const FALLBACK = [
  { id: 1, boutique: 'COSMETIC', label: 'Achetez chez COSMETIC', image_url: imgCosmetic },
  { id: 2, boutique: 'SAFIA',    label: 'Achetez chez SAFIA',    image_url: imgSafia,   featured: true },
  { id: 3, boutique: 'DAR LHNA', label: 'Achetez chez DAR LHNA', image_url: imgDarLhna },
]

export default function ArtisansSection() {
  const [artisans, setArtisans] = useState(FALLBACK)

  useEffect(() => {
    artisansApi.featured()
      .then((res) => {
        const data = res.data?.data ?? []
        if (data.length >= 3) {
          setArtisans(
            data.slice(0, 3).map((a, i) => ({
              ...a,
              label:    `Achetez chez ${a.boutique}`,
              featured: i === 1,
            }))
          )
        }
      })
      .catch(() => {}) // Garde les artisans de secours
  }, [])

  return (
    <section className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-xs md:text-3xl font-medium tracking-tight text-black">
            Artisans du Mois
          </h2>
          <Link
            to="/artisans"
            className="font-manrope text-[12px] text-gray-900 hover:text-amber-700 font-semibold tracking-widest uppercase flex items-center gap-1"
          >
            Voir tous les artisans →
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-12 md:gap-16">
          {artisans.map((artisan) => (
            <Link
              to={`/artisans/${artisan.id}`}
              key={artisan.id}
              className={`flex flex-col items-center transition-all duration-500 ${artisan.featured ? 'w-full md:w-1/4 z-10' : 'w-full md:w-1/4 opacity-90'}`}
            >
              <div className={`relative w-full overflow-hidden mb-6 ${artisan.featured ? 'aspect-[2/3] md:-translate-y-6' : 'aspect-[2/3]'}`}>
                {artisan.image_url ? (
                  <img src={artisan.image_url} alt={artisan.label}
                    className="w-full h-full object-cover shadow-sm" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-semibold">
                    {artisan.boutique}
                  </div>
                )}
                {artisan.featured && (
                  <>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-pink-400" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-pink-400" />
                  </>
                )}
              </div>
              <span className="font-manrope text-[12px] font-bold text-black uppercase tracking-widest text-center hover:text-amber-700 transition-colors">
                {artisan.label}
              </span>
              {artisan.nb_produits != null && (
                <span className="text-[11px] text-gray-400 mt-1">{artisan.nb_produits} produits</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}