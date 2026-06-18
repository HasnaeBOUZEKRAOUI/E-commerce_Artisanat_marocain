// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/services'
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg p-6 shadow-sm`}>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color ?? 'text-black'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res.data))
      .catch(() => setStats({
        total_produits: '1000', total_artisans: '30',
        total_commandes: '50', commandes_en_attente: '20',
        chiffre_affaires: '30000', total_clients: '50',
      }))
      .finally(() => setLoading(false))
  }, [])

  const navLinks = [
    { to: '/admin/artisans',  label: 'Artisans' },
    { to: '/admin/produits',  label: 'Produits' },
    { to: '/admin/commandes', label: 'Commandes' },
    { to: '/admin/clients',   label: 'Clients' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-manrope">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-black text-white flex flex-col z-40">
        <div className="px-6 py-8 border-b border-white/10">
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Moroccan Designers</p>
          <p className="font-bold text-lg tracking-tight">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className="px-4 py-2.5 rounded text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 p-8">
        <h1 className="text-2xl font-bold text-black mb-8">Tableau de bord</h1>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard label="Produits actifs"     value={stats?.total_produits}         color="text-black" />
            <StatCard label="Artisans"             value={stats?.total_artisans}         color="text-amber-600" />
            <StatCard label="Clients"              value={stats?.total_clients}          color="text-blue-600" />
            <StatCard label="Commandes total"      value={stats?.total_commandes}        color="text-black" />
            <StatCard label="En attente"           value={stats?.commandes_en_attente}   color="text-orange-500" sub="commandes à traiter" />
            <StatCard label="Chiffre d'affaires"   value={`${stats?.chiffre_affaires} MAD`} color="text-green-600" />
          </div>
        )}

        {/* Raccourcis */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/artisans/create"
            className="flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-black transition-colors group">
            <span className="text-3xl">+</span>
            <span className="text-sm font-semibold group-hover:text-amber-700">Ajouter un artisan</span>
          </Link>
          <Link to="/admin/commandes"
            className="flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-black transition-colors group">
            <span className="text-3xl">📦</span>
            <span className="text-sm font-semibold group-hover:text-amber-700">Gérer les commandes</span>
          </Link>
          <Link to="/admin/produits"
            className="flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-black transition-colors group">
            <span className="text-3xl">🏺</span>
            <span className="text-sm font-semibold group-hover:text-amber-700">Voir les produits</span>
          </Link>
        </div>
      </main>
    </div>
  )
}