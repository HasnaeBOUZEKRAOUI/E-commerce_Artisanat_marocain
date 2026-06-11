// src/components/layout/NavBar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo          from '../../assets/images/logo.png'
import { useAuth }   from '../../context/AuthContext'
import { useCartContext } from '../../context/CartContext'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout }        = useAuth()
  const { totalItems }          = useCartContext()
  const navigate                = useNavigate()

  const navLinks = [
    { label: 'DÉCORATION',   slug: 'decoration' },
    { label: 'FEMMES',       slug: 'femmes' },
    { label: 'HOMMES',       slug: 'hommes' },
    { label: 'SOINS',        slug: 'soins' },
    { label: 'GASTRONOMIE',  slug: 'gastronomie' },
    { label: 'PERSONNALISER', slug: 'personnaliser' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <div className="bg-black text-white text-center py-2.5 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">
        Livraison gratuite limitée pour toute commande de 250€/$
      </div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] px-6 lg:px-10 flex items-center justify-between h-20">

          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <img src={logo} alt="Moroccan Designers" className="h-12 w-auto object-contain" />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.slug}>
                <Link
                  to={`/categories/${link.slug}`}
                  className="text-[15px] font-fustat tracking-[0.1em] text-black hover:text-amber-700 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            {/* Recherche */}
            <button className="text-gray-900 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Compte — connecté ou non */}
            {user ? (
              <div className="relative group">
                <button className="text-gray-900 hover:text-amber-700 transition-colors flex items-center gap-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {/* Dropdown */}
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 shadow-lg rounded z-50">
                  <div className="px-4 py-2 text-xs text-gray-400 border-b">{user.prenom ?? user.email}</div>
                  <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mon profil</Link>
                  <Link to="/commandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mes commandes</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-900 hover:text-amber-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                  <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}

            {/* Panier avec badge */}
            <Link to="/panier" className="relative text-gray-900 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Burger mobile */}
            <button className="lg:hidden text-gray-900 ml-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 shadow-xl">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.slug}>
                  <Link to={`/categories/${link.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-semibold tracking-widest text-gray-800 uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}