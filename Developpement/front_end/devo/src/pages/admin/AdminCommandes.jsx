// src/pages/admin/AdminCommandes.jsx
import { useState, useEffect } from 'react'
import { commandeApi } from '../../api/services' 
import AdminLayout from '../../components/admin/AdminLayout'

const STATUTS = ['tous', 'en_attente', 'confirmee', 'expediee', 'livree', 'annulee']

const STATUT_STYLES = {
  en_attente:  'bg-orange-100 text-orange-700',
  confirmee:   'bg-blue-100 text-blue-700',
  expediee:    'bg-purple-100 text-purple-700',
  livree:      'bg-green-100 text-green-700',
  annulee:     'bg-red-100 text-red-600',
}

const STATUT_LABELS = {
  en_attente:  'En attente',
  confirmee:   'Confirmée',
  expediee:    'Expédiée',
  livree:      'Livrée',
  annulee:     'Annulée',
}

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading]     = useState(true)
  const [statut, setStatut]       = useState('tous')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [selected, setSelected]   = useState(null) // Commande sélectionnée pour détail
  const [updating, setUpdating]   = useState(null)
  const fakeData = {
    data: [
      { id: 101, client_nom: "Youssef Alaoui", date_commande: "18/06/2026", montant_total: 1250, statut: "en_attente", adresse_livraison: "12 Rue Tanger, Maroc", lignes: [{ nom: "Tapis Berbère", quantite: 1, prix_unitaire: 1250 }] },
      { id: 102, client_nom: "Fatima Zahra", date_commande: "17/06/2026", montant_total: 800, statut: "confirmee", adresse_livraison: "5 Av. Mohammed V, Fès", lignes: [{ nom: "Poterie artisanale", quantite: 2, prix_unitaire: 400 }] },
      { id: 103, client_nom: "Omar Idrissi", date_commande: "15/06/2026", montant_total: 3200, statut: "expediee", adresse_livraison: "Quartier Guéliz, Marrakech", lignes: [{ nom: "Lanterne en cuivre", quantite: 1, prix_unitaire: 3200 }] }
    ],
    current_page: 1, last_page: 1, total: 3
  };
  
  setTimeout(() => {
    setCommandes(fakeData.data);
    setMeta({ current_page: fakeData.current_page, last_page: fakeData.last_page, total: fakeData.total });
    setLoading(false);
  }, 800);
//   const fetch = () => {
//     setLoading(true)
//     commandeApi.getAll({ page, statut: statut === 'tous' ? null : statut }) 
//          .then(res => {
//         setCommandes(res.data.data ?? [])
//         setMeta({ current_page: res.data.current_page, last_page: res.data.last_page, total: res.data.total })
//       })
//       .finally(() => setLoading(false))
//   }

  useEffect(() => { fetch() }, [page, statut])

  const updateStatut = async (id, newStatut) => {
    setUpdating(id)
    await commandeApi.updateStatut()
    fetch()
    if (selected?.id === id) setSelected(prev => ({ ...prev, statut: newStatut }))
    setUpdating(null)
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Commandes</h1>
          {meta && <p className="text-sm text-gray-400 mt-0.5">{meta.total} commandes</p>}
        </div>
      </div>

      {/* Filtres statut */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUTS.map(s => (
          <button key={s} onClick={() => { setStatut(s); setPage(1) }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
              statut === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
            }`}>
            {s === 'tous' ? 'Tous' : STATUT_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : commandes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucune commande.</td></tr>
              ) : commandes.map(c => (
                <tr key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === c.id ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3 font-mono text-gray-500">#{c.id}</td>
                  <td className="px-4 py-3 font-medium text-black">{c.client_nom}</td>
                  <td className="px-4 py-3 text-gray-500">{c.date_commande}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{Number(c.montant_total).toLocaleString('fr-FR')} MAD</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUT_STYLES[c.statut]}`}>
                      {STATUT_LABELS[c.statut]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={c.statut}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatut(c.id, e.target.value)}
                      disabled={updating === c.id}
                      className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-black disabled:opacity-50"
                    >
                      {Object.entries(STATUT_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Détail commande */}
        {selected && (
          <div className="w-72 bg-white border border-gray-100 rounded-lg shadow-sm p-5 self-start flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black">Commande #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-black text-lg">×</button>
            </div>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between"><span>Client</span><span className="font-medium text-black">{selected.client_nom}</span></div>
              <div className="flex justify-between"><span>Date</span><span>{selected.date_commande}</span></div>
              <div className="flex justify-between"><span>Adresse</span><span className="text-right max-w-[140px]">{selected.adresse_livraison}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold text-black">Total</span>
                <span className="font-mono font-bold text-black">{Number(selected.montant_total).toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Produits</p>
              <ul className="space-y-1.5">
                {(selected.lignes ?? []).map((l, i) => (
                  <li key={i} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate max-w-[150px]">{l.nom} ×{l.quantite}</span>
                    <span className="font-mono">{Number(l.prix_unitaire * l.quantite).toLocaleString('fr-FR')} MAD</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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