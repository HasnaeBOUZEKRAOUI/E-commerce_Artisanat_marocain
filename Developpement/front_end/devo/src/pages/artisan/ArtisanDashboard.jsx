// src/pages/artisan/ArtisanDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import ArtisanLayout from '../../components/artisan/ArtisanLayout'

export default function ArtisanDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [commandes, setCommandes] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/artisan/stats'),
      api.get('/artisan/commandes', { params: { per_page: 5, statut: 'en_attente' } }),
    ])
      .then(([statsRes, cmdRes]) => {
        setStats(statsRes.data)
        setCommandes(cmdRes.data.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <ArtisanLayout>
      <h1 className="text-2xl font-bold text-black mb-8">Ma Boutique</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Produits actifs',    value: stats?.total_produits ?? '—' },
          { label: 'Commandes totales',  value: stats?.total_commandes ?? '—' },
          { label: 'En attente',         value: stats?.commandes_en_attente ?? '—', highlight: true },
          { label: 'Revenu total',       value: stats ? `${Number(stats.revenu_total).toLocaleString('fr-FR')} MAD` : '—' },
        ].map((s, i) => (
          <div key={i} className={`bg-white border rounded-lg p-5 shadow-sm ${s.highlight ? 'border-orange-200' : 'border-gray-100'}`}>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.highlight ? 'text-orange-500' : 'text-black'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/artisan/produits/create"
          className="flex items-center gap-4 p-5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <span className="text-2xl">+</span>
          <span className="font-semibold">Ajouter un produit</span>
        </Link>
        <Link to="/artisan/commandes"
          className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-lg hover:border-black transition-colors">
          <span className="text-2xl">📦</span>
          <span className="font-semibold text-black">Gérer les expéditions</span>
        </Link>
      </div>

      {/* Commandes en attente */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-black">Commandes en attente</h2>
          <Link to="/artisan/commandes" className="text-xs text-amber-600 hover:underline font-semibold">
            Voir toutes →
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : commandes.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Aucune commande en attente.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {commandes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-gray-500">#{c.id}</td>
                  <td className="px-6 py-3 font-medium">{c.client_nom}</td>
                  <td className="px-6 py-3 text-gray-500">{c.date_commande}</td>
                  <td className="px-6 py-3 text-right font-mono font-semibold">
                    {Number(c.montant_total).toLocaleString('fr-FR')} MAD
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link to={`/artisan/commandes/${c.id}`}
                      className="text-xs text-blue-600 hover:underline">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ArtisanLayout>
  )
}