// src/components/layout/NavBar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo               from '../../assets/images/logo.png'
import { useAuth }        from '../../context/AuthContext'
import { useCartContext } from '../../context/CartContext'
import { categoriesApi }  from '../../api/services'

// ── Mega Menu d'une grande catégorie ─────────────────────────────────────────
function MegaMenu({ category, onClose }) {
  if (!category?.sous?.length) return null

  return (
    <div
      className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1440px] mx-auto px-10 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-8">
          {category.sous.map((sous) => (
            <div key={sous.slug}>
              {/* Titre niveau 2 */}
              <Link
                to={`/categories/${sous.slug}`}
                onClick={onClose}
                className="block text-[13px] font-bold tracking-widest uppercase text-black mb-3 hover:text-amber-700 transition-colors"
              >
                {sous.nom}
              </Link>

              {/* Items niveau 3 */}
              <ul className="flex flex-col gap-2">
                {sous.sous?.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/categories/${item.slug}`}
                      onClick={onClose}
                      className="text-[13px] text-gray-600 hover:text-amber-700 transition-colors leading-relaxed"
                    >
                      {item.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── NavBar principale ─────────────────────────────────────────────────────────
export default function NavBar() {
  const [menuData, setMenuData]       = useState([])
  const [activeSlug, setActiveSlug]   = useState(null)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, logout }   = useAuth()
  const { totalItems }     = useCartContext()
  const navigate           = useNavigate()
  const location           = useLocation()
  const navRef             = useRef(null)
  const searchRef          = useRef(null)

  // Charge le menu depuis l'API Laravel
  useEffect(() => {
    categoriesApi.menu()
      .then((res) => setMenuData(res.data.data ?? []))
      .catch(() => setMenuData(FALLBACK_MENU))
  }, [])

  // Ferme le mega menu sur changement de route
  useEffect(() => {
    setActiveSlug(null)
    setMobileOpen(false)
  }, [location.pathname])

  // Ferme le menu si clic dehors
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveSlug(null)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const activeCategory = menuData.find((c) => c.slug === activeSlug) ?? null

  return (
    <>
      {/* Bandeau promo */}
      <div className="bg-black text-white text-center py-2.5 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">
        Livraison gratuite pour toute commande au dessus de 1500 MAD
      </div>

      <nav ref={navRef} className="bg-white border-b border-gray-100 sticky top-0 z-50">

        {/* ── Barre principale ─────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Artisanat Marocain" className="h-12 w-auto object-contain" />
          </Link>

          {/* Menu desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            {menuData.map((cat) => (
              <li key={cat.slug} className="relative">
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-[13px] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${
                    activeSlug === cat.slug
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                >
                  {cat.nom}
                  <svg className="w-3 h-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          {/* Actions droite */}
          <div className="flex items-center gap-4">

            {/* Recherche */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="text-gray-800 hover:text-amber-700 transition-colors"
                aria-label="Rechercher"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {searchOpen && (
                <form onSubmit={handleSearch}
                  className="absolute right-0 top-full mt-3 w-72 bg-white border border-gray-200 shadow-lg rounded-sm overflow-hidden z-50">
                  <div className="flex items-center px-4 py-3 gap-3">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un produit..."
                      className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Compte */}
            {user ? (
              <div className="relative group">
                <button className="text-gray-800 hover:text-amber-700 transition-colors" aria-label="Mon compte">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 shadow-lg z-50">
                  <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-100">
                    Bonjour, <span className="font-semibold text-black">{user.prenom ?? user.nom}</span>
                  </div>
                  <Link to="/profil" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Mon profil
                  </Link>
                  <Link to="/commandes" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Mes commandes
                  </Link>
                  <div className="border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-amber-700 transition-colors" aria-label="Se connecter">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}

            {/* Panier */}
            <Link to="/panier" className="relative text-gray-800 hover:text-amber-700 transition-colors" aria-label="Panier">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Burger mobile */}
            <button
              className="lg:hidden text-gray-800 ml-1"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mega Menu desktop ─────────────────────────────────── */}
        {activeSlug && activeCategory && (
          <MegaMenu category={activeCategory} onClose={() => setActiveSlug(null)} />
        )}

        {/* ── Menu mobile ───────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            {menuData.map((cat) => (
              <div key={cat.slug} className="border-b border-gray-100">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                  className="w-full flex items-center justify-between px-6 py-4 text-[13px] font-bold tracking-widest uppercase text-black"
                >
                  {cat.nom}
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileExpanded === cat.slug ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileExpanded === cat.slug && (
                  <div className="px-6 pb-4 bg-gray-50">
                    {cat.sous?.map((sous) => (
                      <div key={sous.slug} className="mb-4">
                        <Link
                          to={`/categories/${sous.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block text-[12px] font-semibold tracking-wider uppercase text-gray-800 mb-2 hover:text-amber-700"
                        >
                          {sous.nom}
                        </Link>
                        <ul className="flex flex-col gap-1.5 pl-2">
                          {sous.sous?.map((item) => (
                            <li key={item.slug}>
                              <Link
                                to={`/categories/${item.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="text-[13px] text-gray-500 hover:text-amber-700 transition-colors"
                              >
                                {item.nom}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}

// ── Fallback si l'API est indisponible ───────────────────────────────────────
const FALLBACK_MENU = [
  {
    nom: 'HOME & LIVING', slug: 'home-living',
    sous: [
      { nom: 'DINING', slug: 'dining', sous: [
        { nom: 'Tagines', slug: 'tagines' },
        { nom: 'Cups & Mugs', slug: 'cups-mugs' },
        { nom: 'Plates & Bowls', slug: 'plates-bowls' },
      ]},
      { nom: 'LIVING ROOM', slug: 'living-room-bedroom', sous: [
        { nom: 'Rugs', slug: 'rugs' },
        { nom: 'Cushions', slug: 'cushions-pillowcases' },
        { nom: 'Lamps', slug: 'lamps-lampshades' },
      ]},
    ],
  },
  {
    nom: 'FASHION', slug: 'fashion',
    sous: [
      { nom: 'Women', slug: 'fashion-women', sous: [
        { nom: 'Kaftans', slug: 'kaftans' },
        { nom: 'Jellabas', slug: 'jellabas-women' },
      ]},
      { nom: 'Men', slug: 'fashion-men', sous: [
        { nom: 'Jellabas & Gandouras', slug: 'jellabas-gandouras' },
      ]},
    ],
  },
  {
    nom: 'JEWELRY', slug: 'jewelry',
    sous: [
      { nom: 'Women', slug: 'jewelry-women', sous: [
        { nom: 'Necklace', slug: 'necklace-women' },
        { nom: 'Ring', slug: 'ring-women' },
      ]},
      { nom: 'Men', slug: 'jewelry-men', sous: [
        { nom: 'Necklace', slug: 'necklace-men' },
      ]},
    ],
  },
  {
    nom: 'BEAUTY & HAMMAM', slug: 'beauty-hammam',
    sous: [
      { nom: 'FACE CARE', slug: 'face-care', sous: [
        { nom: 'Face Mask', slug: 'face-mask' },
        { nom: 'Face Oil', slug: 'face-oil' },
      ]},
      { nom: 'BODY CARE', slug: 'body-care', sous: [
        { nom: 'Body Oils', slug: 'body-oils' },
        { nom: 'Hammam Essentials', slug: 'hammam-essentials' },
      ]},
    ],
  },
  {
    nom: 'MOROCCAN PANTRY', slug: 'moroccan-pantry',
    sous: [
      { nom: 'MOROCCAN PANTRY', slug: 'moroccan-pantry-sub', sous: [
        { nom: 'Culinary Oils', slug: 'culinary-oils' },
        { nom: 'Honey', slug: 'honey' },
        { nom: 'Teas & Saffron', slug: 'teas-saffron' },
      ]},
    ],
  },
]