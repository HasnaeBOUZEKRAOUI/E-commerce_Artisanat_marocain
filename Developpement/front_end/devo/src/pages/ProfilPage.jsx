import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState('personnel');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 💡 Structure calquée exactement sur ton modèle Utilisateur
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: ''
  });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await api.get('/user/profil'); // URL de ton profilApi.get()
        const user = response.data;
        
        setFormData({
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          // On cherche d'abord dans l'utilisateur, puis dans son profil client par sécurité
          telephone: user.telephone || user.client?.telephone || '',
          adresse: user.adresse || user.client?.adresse || '',
          ville: user.ville || user.client?.ville || ''
        });
      } catch (err) {
        console.error("Erreur profil:", err);
        setMessage({ type: 'error', text: 'Impossible de charger vos données.' });
      }  finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/profil', formData); // URL de ton profilApi.update()
      setMessage({ type: 'success', text: response.data.message });
    } catch (err) {
      const errors = err.response?.data?.errors;
      const errorMsg = errors ? Object.values(errors)[0][0] : "Une erreur est survenue.";
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-manrope">
        <div className="animate-pulse text-xs uppercase tracking-widest text-gray-400">Chargement de votre compte...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-manrope text-gray-900 py-12 px-4 md:px-16">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
        
        {/* Header Profil */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-8 text-center md:text-left md:flex md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl uppercase tracking-widest">Mon Compte</h1>
            <p className="text-xs text-gray-400 mt-1">Gérez vos informations personnelles.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg mx-auto md:mx-0">
            {formData.nom ? formData.nom.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-100 text-xs uppercase tracking-wider font-semibold">
          <button 
            type="button"
            onClick={() => setActiveTab('personnel')}
            className={`flex-1 py-4 text-center transition-all border-b-2 ${activeTab === 'personnel' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            Informations personnelles
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('livraison')}
            className={`flex-1 py-4 text-center transition-all border-b-2 ${activeTab === 'livraison' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            Adresse de livraison
          </button>
        </div>

        {/* Notifications */}
        {message.text && (
          <div className="p-4 mx-6 mt-6 text-xs text-center rounded border transition-all">
            <span className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {message.text}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* ONGLET PERSONNEL */}
          {activeTab === 'personnel' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none"
                  disabled // L'email sert d'identifiant unique, souvent désactivé à la modif
                />
              </div>
            </div>
          )}

          {/* ONGLET LIVRAISON */}
          {activeTab === 'livraison' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Numéro de Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-gray-900 hover:bg-black text-white text-xs font-medium uppercase tracking-widest px-6 py-3 rounded">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}