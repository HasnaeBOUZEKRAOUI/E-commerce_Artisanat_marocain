// src/pages/artisan/ArtisanProduitForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import { categoriesApi } from '../../api/services'
import ArtisanLayout from '../../components/artisan/ArtisanLayout'

export default function ArtisanProduitForm() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isEdit    = Boolean(id)

  const [form, setForm] = useState({
    nom: '', description: '', prix: '', stock: '',
    categorie_id: '', style: '', statut: 'actif',
  })
  const [caracteristiques, setCaract] = useState([{ nom: '', valeur: '' }])
  const [images, setImages]   = useState([{ url: '' }])
  const [categories, setCats] = useState([])
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(false)

  // Charge les catégories niveau 3 (celles qui contiennent les produits)
  useEffect(() => {
    api.get('/categories', { params: { niveau: 3 } })
      .then(res => setCats(res.data.data ?? []))
  }, [])

  // Si édition, charge le produit
  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    api.get(`/artisan/produits/${id}`)
      .then(res => {
        const p = res.data
        setForm({
          nom: p.nom ?? '', description: p.description ?? '',
          prix: p.prix ?? '', stock: p.stock ?? '',
          categorie_id: p.categorie?.id ?? '', style: p.style ?? '',
          statut: p.statut ?? 'actif',
        })
        if (p.caracteristiques?.length) {
          setCaract(p.caracteristiques.map(c => ({ nom: c.nom, valeur: c.valeur })))
        }
        if (p.images?.length) {
          setImages(p.images.map(i => ({ url: i.url })))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const handleCaract = (i, field, val) => {
    setCaract(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }

  const handleImage = (i, val) => {
    setImages(prev => prev.map((img, idx) => idx === i ? { url: val } : img))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = {
      ...form,
      caracteristiques: caracteristiques.filter(c => c.nom && c.valeur),
      images: images.filter(i => i.url).map(i => i.url),
    }

    try {
      if (isEdit) {
        await api.put(`/artisan/produits/${id}`, payload)
      } else {
        await api.post('/artisan/produits', payload)
      }
      navigate('/artisan/produits')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, name, type = 'text', required = false }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} required={required}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black ${errors[name] ? 'border-red-400' : 'border-gray-200'}`} />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name][0]}</p>}
    </div>
  )

  return (
    <ArtisanLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Infos générales */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 pb-2 border-b border-gray-100">
              Informations générales
            </h2>
            <Field label="Nom du produit" name="nom" required />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix (MAD)" name="prix" type="number" required />
              <Field label="Stock"      name="stock" type="number" required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                <select name="categorie_id" value={form.categorie_id} onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black">
                  <option value="">Choisir...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Style</label>
                <select name="style" value={form.style} onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black">
                  <option value="">Aucun</option>
                  <option value="moderne">Moderne</option>
                  <option value="traditionnel">Traditionnel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Statut</label>
                <select name="statut" value={form.statut} onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Images (URLs)</h2>
              <button type="button" onClick={() => setImages(prev => [...prev, { url: '' }])}
                className="text-xs text-amber-600 hover:underline font-semibold">+ Ajouter</button>
            </div>
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="url" value={img.url} onChange={e => handleImage(i, e.target.value)}
                    placeholder={`URL image ${i + 1}`}
                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  {i === 0 && <span className="text-xs text-amber-600 font-semibold whitespace-nowrap">Principale</span>}
                  {i > 0 && (
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Caractéristiques</h2>
              <button type="button" onClick={() => setCaract(prev => [...prev, { nom: '', valeur: '' }])}
                className="text-xs text-amber-600 hover:underline font-semibold">+ Ajouter</button>
            </div>
            <div className="space-y-2">
              {caracteristiques.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={c.nom} onChange={e => handleCaract(i, 'nom', e.target.value)}
                    placeholder="Nom (ex: Couleur)"
                    className="w-40 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  <input value={c.valeur} onChange={e => handleCaract(i, 'valeur', e.target.value)}
                    placeholder="Valeur (ex: Rouge)"
                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  {i > 0 && (
                    <button type="button" onClick={() => setCaract(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate('/artisan/produits')}
              className="text-sm text-gray-500 hover:text-black transition-colors">Annuler</button>
            <button type="submit" disabled={saving}
              className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 hover:bg-gray-800 transition-colors disabled:opacity-60">
              {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Publier le produit'}
            </button>
          </div>
        </form>
      </div>
    </ArtisanLayout>
  )
}