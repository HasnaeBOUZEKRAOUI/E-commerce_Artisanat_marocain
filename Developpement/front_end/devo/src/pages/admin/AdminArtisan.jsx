// src/pages/admin/AdminArtisans.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminArtisans() {
  const [artisans, setArtisans]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/admin/artisans', { params: { page, search, per_page: 15 } })
      .then(res => {
        setArtisans(res.data.data ?? [])
        setMeta({ current_page: res.data.current_page, last_page: res.data.last_page, total: res.data.total })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Simuler un appel API avec des données fake
    const fakeArtisans = [
      { id: 1, boutique: "Art du Zellige", nom: "Alaoui", prenom: "Ahmed", email: "ahmed@zellige.ma", nb_produits: 12, actif: true },
      { id: 2, boutique: "Cuir de Fès", nom: "Bennani", prenom: "Fatima", email: "fatima@cuir.ma", nb_produits: 8, actif: false },
      { id: 3, boutique: "Tapis Atlas", nom: "Idrissi", prenom: "Omar", email: "omar@atlas.ma", nb_produits: 25, actif: true },
    ];

    setArtisans(fakeArtisans);
    setMeta({ current_page: 1, last_page: 1, total: 3 });
    setLoading(false);
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Artisans</h1>
          {meta && <p className="text-sm text-gray-400 mt-0.5">{meta.total} artisans enregistrés</p>}
        </div>
        <Link to="/admin/artisans/create"
          className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 hover:bg-gray-800 transition-colors">
          + Ajouter un artisan
        </Link>
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par boutique ou email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full max-w-sm border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Boutique</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Artisan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produits</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : artisans.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun artisan trouvé.</td></tr>
            ) : artisans.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-black">{a.boutique}</td>
                <td className="px-4 py-3 text-gray-600">{a.prenom} {a.nom}</td>
                <td className="px-4 py-3 text-gray-500">{a.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className="font-mono text-black">{a.nb_produits}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleToggle(a.id)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      a.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                    {a.actif ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                  <Link to={`/admin/artisans/${a.id}/edit`}
                    className="text-xs text-blue-600 hover:underline">Modifier</Link>
                  <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                    className="text-xs text-red-500 hover:underline disabled:opacity-40">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded border transition-colors ${
                p === meta.current_page ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
              }`}>{p}</button>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}