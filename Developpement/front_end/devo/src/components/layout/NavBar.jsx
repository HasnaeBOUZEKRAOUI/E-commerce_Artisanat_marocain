// src/components/layout/NavBar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../context/AuthContext'
import { useCartContext } from '../../context/CartContext'
import { categoriesApi } from '../../api/services'

// ── Mega Menu d'une grande catégorie (Optimisé et plus grand) ─────────────────
function MegaMenu({ category, onClose }) {
  if (!category?.sous?.length) return null

  return (
    <div
      className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-2xl z-50 animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1440px] mx-auto px-10 py-12">
        {/* Grille mieux espacée avec séparateurs verticaux discrets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 divide-x divide-gray-100">
          {category.sous.map((sous, idx) => (
            <div key={sous.slug} className={idx > 0 ? "pl-8" : ""}>
              {/* Titre Niveau 2 : Plus grand, plus lisible */}
              <Link
                to={`/categories/${sous.slug}`}
                onClick={onClose}
                className="block text-sm font-bold tracking-wider uppercase text-black mb-4 hover:text-amber-700 transition-colors duration-200"
              >
                {sous.nom}
              </Link>

              {/* Items Niveau 3 : Agrandis et mieux aérés */}
              <ul className="flex flex-col gap-3">
                {sous.sous?.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/categories/${item.slug}`}
                      onClick={onClose}
                      className="text-sm text-gray-600 hover:text-amber-700 hover:pl-1 transition-all duration-200 block"
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
  const [menuData, setMenuData] = useState([])
  const [activeSlug, setActiveSlug] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, logout } = useAuth()
  const { totalItems } = useCartContext()
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    categoriesApi.menu()
      .then((res) => setMenuData(res.data.data ?? []))
      .catch(() => setMenuData(FALLBACK_MENU))
  }, [])

  useEffect(() => {
    setActiveSlug(null)
    setMobileOpen(false)
  }, [location.pathname])

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
      <div className="bg-black text-white text-center py-3 text-xs tracking-[0.2em] font-semibold uppercase">
        Livraison gratuite pour toute commande au dessus de 1500 MAD
      </div>

      <nav ref={navRef} className="bg-white border-b border-gray-100 sticky top-0 z-50">

        {/* ── Barre principale ─────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between h-24">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Artisanat Marocain" className="h-16 w-auto object-contain" />
          </Link>

          {/* Menu principal Desktop : Lettres plus grandes (text-sm) et mieux espacées */}
          <ul className="hidden lg:flex items-center gap-2 h-full">
            {menuData.map((cat) => (
              <li 
                key={cat.slug} 
                className="h-full flex items-center"
                onMouseEnter={() => setActiveSlug(cat.slug)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 h-full text-sm font-bold tracking-[0.15em] uppercase transition-all duration-200 relative ${
                    activeSlug === cat.slug ? 'text-amber-700' : 'text-gray-800 hover:text-black'
                  }`}
                >
                  {cat.nom}
                  <svg className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${activeSlug === cat.slug ? 'rotate-180 text-amber-700' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* Ligne active sous le bouton */}
                  {activeSlug === cat.slug && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-700 content-['']" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Actions droite */}
          <div className="flex items-center gap-5">

            {/* Recherche */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="text-gray-800 hover:text-amber-700 transition-colors p-1"
                aria-label="Rechercher"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {searchOpen && (
                <form onSubmit={handleSearch}
                  className="absolute right-0 top-full mt-4 w-80 bg-white border border-gray-200 shadow-xl rounded-sm overflow-hidden z-50">
                  <div className="flex items-center px-4 py-3.5 gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
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
                <button className="text-gray-800 hover:text-amber-700 transition-colors p-1" aria-label="Mon compte">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg z-50">
                  <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-100">
                    Bonjour, <span className="font-semibold text-black">{user.prenom ?? user.nom}</span>
                  </div>
                  <Link to="/profil" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    Mon profil
                  </Link>
                  <Link to="/commandes" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    Mes commandes
                  </Link>
                  <div className="border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left">
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-amber-700 transition-colors p-1" aria-label="Se connecter">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}

            {/* Panier */}
            <Link to="/panier" className="relative text-gray-800 hover:text-amber-700 transition-colors p-1" aria-label="Panier">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold min-w-[18px] h-4.5 px-1 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Burger mobile */}
            <button
              className="lg:hidden text-gray-800 ml-1 p-1"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENEUR MEGA MENU MOUSE LEAVE : Évite les fermetures accidentelles */}
        <div onMouseLeave={() => setActiveSlug(null)}>
          {activeSlug && activeCategory && (
            <MegaMenu category={activeCategory} onClose={() => setActiveSlug(null)} />
          )}
        </div>

        {/* ── Menu Mobile (Ajusté pour correspondre à la taille globale) ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            {menuData.map((cat) => (
              <div key={cat.slug} className="border-b border-gray-100">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-sm font-bold tracking-wider uppercase text-black"
                >
                  {cat.nom}
                  <svg
                    className={`w-5 h-5 transition-transform ${mobileExpanded === cat.slug ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileExpanded === cat.slug && (
                  <div className="px-6 pb-5 bg-gray-50/50 pt-2">
                    {cat.sous?.map((sous) => (
                      <div key={sous.slug} className="mb-5">
                        <Link
                          to={`/categories/${sous.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm font-bold tracking-wide uppercase text-gray-900 mb-2.5 hover:text-amber-700"
                        >
                          {sous.nom}
                        </Link>
                        <ul className="flex flex-col gap-2 pl-3 border-l border-gray-200">
                          {sous.sous?.map((item) => (
                            <li key={item.slug}>
                              <Link
                                to={`/categories/${item.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-gray-600 hover:text-amber-700 block py-0.5"
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
