// src/pages/artisan/ArtisanExpeditions.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import ArtisanLayout from '../../components/artisan/ArtisanLayout'

const STATUTS = ['tous', 'en_attente', 'confirmee', 'expediee', 'livree', 'annulee']

const STATUT_STYLES = {
  en_attente: 'bg-orange-100 text-orange-700',
  confirmee:  'bg-blue-100 text-blue-700',
  expediee:   'bg-purple-100 text-purple-700',
  livree:     'bg-green-100 text-green-700',
  annulee:    'bg-red-100 text-red-600',
}

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  expediee:   'Expédiée',
  livree:     'Livrée',
  annulee:    'Annulée',
}

// Étapes d'expédition dans l'ordre
const EXPEDITION_STEPS = ['en_attente', 'confirmee', 'expediee', 'livree']

export default function ArtisanExpeditions() {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading]     = useState(true)
  const [statut, setStatut]       = useState('tous')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [selected, setSelected]   = useState(null)
  const [updating, setUpdating]   = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/artisan/commandes', {
      params: { page, statut: statut === 'tous' ? null : statut, per_page: 12 }
    })
      .then(res => {
        setCommandes(res.data.data ?? [])
        setMeta({
          current_page: res.data.current_page,
          last_page:    res.data.last_page,
          total:        res.data.total,
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page, statut])

  const updateStatut = async (id, newStatut) => {
    setUpdating(id)
    await api.put(`/artisan/commandes/${id}/expedition`, { statut: newStatut })
    fetch()
    if (selected?.id === id) setSelected(prev => ({ ...prev, statut: newStatut }))
    setUpdating(null)
  }

  const nextStatut = (current) => {
    const idx = EXPEDITION_STEPS.indexOf(current)
    return idx >= 0 && idx < EXPEDITION_STEPS.length - 1 ? EXPEDITION_STEPS[idx + 1] : null
  }

  return (
    <ArtisanLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Expéditions</h1>
          {meta && <p className="text-sm text-gray-400 mt-0.5">{meta.total} commandes</p>}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUTS.map(s => (
          <button key={s} onClick={() => { setStatut(s); setPage(1) }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              statut === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
            }`}>
            {s === 'tous' ? 'Toutes' : STATUT_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex gap-6">

        {/* Liste commandes */}
        <div className="flex-1 space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : commandes.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
              <p className="text-gray-400">Aucune commande trouvée.</p>
            </div>
          ) : commandes.map(c => (
            <div key={c.id}
              onClick={() => setSelected(c)}
              className={`bg-white border rounded-lg p-4 cursor-pointer hover:border-gray-300 transition-colors ${
                selected?.id === c.id ? 'border-black' : 'border-gray-100'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-gray-500">#{c.id}</span>
                  <span className="font-semibold text-black text-sm">{c.client_nom}</span>
                  <span className="text-xs text-gray-400">{c.date_commande}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm">
                    {Number(c.montant_total).toLocaleString('fr-FR')} MAD
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUT_STYLES[c.statut]}`}>
                    {STATUT_LABELS[c.statut]}
                  </span>
                </div>
              </div>

              {/* Barre de progression expédition */}
              <div className="mt-3 flex items-center gap-1">
                {EXPEDITION_STEPS.map((step, i) => {
                  const current = EXPEDITION_STEPS.indexOf(c.statut)
                  const done    = i <= current
                  return (
                    <div key={step} className="flex items-center gap-1 flex-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${done ? 'bg-black' : 'bg-gray-100'}`} />
                      {i < EXPEDITION_STEPS.length - 1 && (
                        <div className={`w-2 h-2 rounded-full transition-colors ${done ? 'bg-black' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1">
                {EXPEDITION_STEPS.map(step => (
                  <span key={step} className={`text-[9px] uppercase tracking-wider ${
                    c.statut === step ? 'text-black font-bold' : 'text-gray-300'
                  }`}>
                    {STATUT_LABELS[step]}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs rounded border transition-colors ${
                    p === meta.current_page ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
                  }`}>{p}</button>
              ))}
            </div>
          )}
        </div>

        {/* Détail + Actions expédition */}
        {selected && (
          <div className="w-72 flex-shrink-0 space-y-4">

            {/* Détail commande */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-black">Commande #{selected.id}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-black text-lg">×</button>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Client</span>
                  <span className="font-semibold text-black">{selected.client_nom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone</span>
                  <span>{selected.client_tel ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{selected.date_commande}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span>Adresse</span>
                  <span className="text-right max-w-[140px] leading-relaxed">
                    {selected.adresse_livraison}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-mono font-bold text-black">
                    {Number(selected.montant_total).toLocaleString('fr-FR')} MAD
                  </span>
                </div>
              </div>

              {/* Produits de MES articles dans cette commande */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Mes articles
                </p>
                <ul className="space-y-1.5">
                  {(selected.lignes ?? []).map((l, i) => (
                    <li key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[150px]">
                        {l.nom} ×{l.quantite}
                      </span>
                      <span className="font-mono">
                        {Number(l.prix_unitaire * l.quantite).toLocaleString('fr-FR')} MAD
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions expédition */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <h3 className="font-bold text-black mb-4 text-sm">Mettre à jour l'expédition</h3>

              <div className="space-y-2">
                {Object.entries(STATUT_LABELS).map(([val, label]) => {
                  if (val === 'annulee') return null
                  const isCurrentStatut = selected.statut === val
                  const stepIndex       = EXPEDITION_STEPS.indexOf(val)
                  const currentIndex    = EXPEDITION_STEPS.indexOf(selected.statut)
                  const isPast          = stepIndex < currentIndex
                  const isNext          = stepIndex === currentIndex + 1

                  return (
                    <button key={val}
                      onClick={() => !isPast && !isCurrentStatut && updateStatut(selected.id, val)}
                      disabled={isPast || isCurrentStatut || updating === selected.id}
                      className={`w-full text-left px-3 py-2.5 rounded border text-xs font-semibold transition-all ${
                        isCurrentStatut
                          ? 'bg-black text-white border-black'
                          : isPast
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : isNext
                              ? 'border-amber-400 text-amber-700 hover:bg-amber-50 cursor-pointer'
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}>
                      <span className="flex items-center justify-between">
                        <span>{label}</span>
                        {isCurrentStatut && <span>✓ Actuel</span>}
                        {isNext && !isCurrentStatut && <span>→ Passer à cette étape</span>}
                      </span>
                    </button>
                  )
                })}

                {/* Annuler */}
                {selected.statut !== 'livree' && selected.statut !== 'annulee' && (
                  <button
                    onClick={() => window.confirm('Annuler cette commande ?') && updateStatut(selected.id, 'annulee')}
                    disabled={updating === selected.id}
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded border border-red-100 transition-colors mt-2">
                    Annuler la commande
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ArtisanLayout>
  )
}