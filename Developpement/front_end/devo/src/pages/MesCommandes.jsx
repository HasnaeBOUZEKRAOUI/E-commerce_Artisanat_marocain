import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCommandes();
  }, [page]);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      // Appel à la méthode index() du CommandeController
      const response = await api.get(`/commandes?page=${page}`);
      
      // Laravel paginate() renvoie les données dans response.data.data
      setCommandes(response.data.data || []);
      setPagination(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Impossible de charger vos commandes. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Helper pour formater le badge de statut
  const getStatusBadge = (statut) => {
    const styles = {
      en_attente: "bg-amber-50 text-amber-700 border-amber-200",
      paye: "bg-green-50 text-green-700 border-green-200",
      expedie: "bg-blue-50 text-blue-700 border-blue-200",
      annule: "bg-gray-50 text-gray-500 border-gray-200",
    };

    const labels = {
      en_attente: "En attente",
      paye: "Payé",
      expedie: "Expédié",
      annule: "Annulé",
    };

    return (
      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 border rounded-full font-medium ${styles[statut] || styles.en_attente}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-manrope">
        <div className="animate-pulse text-xs uppercase tracking-widest text-gray-400">Chargement de vos commandes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-manrope text-gray-900 py-12 px-4 md:px-16">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* En-tête de la page */}
        <div className="border-b border-gray-200 pb-5">
          <h1 className="font-serif text-2xl uppercase tracking-widest text-center lg:text-left">Mes Commandes</h1>
          <p className="text-xs text-gray-400 mt-1 text-center lg:text-left">Historique et suivi de vos achats chez Moroccan Designers.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded text-center">
            {error}
          </div>
        )}

        {/* Liste des commandes vide */}
        {!loading && commandes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded space-y-4 shadow-sm">
            <p className="text-sm text-gray-400">Vous n'avez pas encore passé de commande.</p>
          </div>
        ) : (
          /* Liste des commandes */
          <div className="space-y-6">
            {commandes.map((commande) => (
              <div key={commande.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                
                {/* Header de la carte de commande */}
                <div className="bg-gray-50 px-4 py-4 md:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-gray-100 text-gray-600">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Commande N°</p>
                    <p className="font-mono font-semibold text-gray-900">#MD-{commande.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="font-medium text-gray-900">{new Date(commande.date_commande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="font-mono font-bold text-gray-900">{Number(commande.montant_total).toLocaleString('fr-FR')} MAD</p>
                  </div>
                  <div className="flex sm:justify-end items-center">
                    {getStatusBadge(commande.statut)}
                  </div>
                </div>

                {/* Corps : Liste des produits inclus (Lignes) */}
                <div className="p-4 md:p-6 divide-y divide-gray-100">
                  {commande.lignes?.map((ligne) => (
                    <div key={ligne.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        {/* Image produit */}
                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={ligne.produit?.image_url || ligne.produit?.image || '/placeholder-product.jpg'} 
                            alt={ligne.produit?.nom} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Nom et détails */}
                        <div className="text-xs space-y-1">
                          <h4 className="font-semibold text-gray-800 line-clamp-1">{ligne.produit?.nom || "Produit supprimé"}</h4>
                          <p className="text-gray-400">Quantité : {ligne.quantite}</p>
                        </div>
                      </div>
                      
                      {/* Prix de la ligne */}
                      <div className="text-right text-xs font-mono font-medium">
                        {(Number(ligne.prix_unitaire) * ligne.quantite).toLocaleString('fr-FR')} MAD
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer de la carte : Adresse de livraison */}
                <div className="bg-gray-50/50 px-4 py-3 md:px-6 text-[11px] text-gray-400 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-2">
                  <p>
                    <span className="font-medium text-gray-500">Adresse de livraison :</span> {commande.adresse_livraison}
                  </p>
                  {commande.paypal_order_id && (
                    <p className="font-mono text-[10px] text-gray-400">Réf PayPal: {commande.paypal_order_id}</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pagination simple */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4 text-xs">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Précédent
            </button>
            <span className="text-gray-500">Page {page} sur {pagination.last_page}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pagination.last_page))}
              disabled={page === pagination.last_page}
              className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Suivant
            </button>
          </div>
        )}

      </div>
    </div>
  );
}