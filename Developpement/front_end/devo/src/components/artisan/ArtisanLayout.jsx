// src/components/artisan/ArtisanLayout.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/artisan',              label: 'Dashboard',    exact: true },
  { to: '/artisan/produits',     label: 'Mes produits' },
  { to: '/artisan/expeditions',  label: 'Expéditions' },
  { to: '/artisan/statistiques', label: 'Statistiques' },
]

export default function ArtisanLayout({ children }) {
  const location  = useLocation()
  const { user, logout } = useAuth()

  const isActive = (to, exact) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-gray-50 font-manrope flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-black text-white flex flex-col z-40">
        <div className="px-6 py-8 border-b border-white/10">
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Moroccan Designers</p>
          <p className="font-bold text-base tracking-tight">Espace Artisan</p>
          <p className="text-xs text-amber-400 mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              className={`px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive(n.to, n.exact)
                  ? 'bg-white/15 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 space-y-2">
          <Link to="/" className="block text-xs text-gray-400 hover:text-white transition-colors">
            ← Retour au site
          </Link>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-56 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}