import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useCartContext } from '../context/CartContext'
import { paypalApi } from '../api/services'
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCartContext()
  const [isProcessing, setIsProcessing] = useState(false)

  // 1. Récupération sécurisée des données du panier transférées par la route
  const { items, totalPrice, note } = location.state || { items: [], totalPrice: 0, note: '' }

  // 2. États (States) manquants pour faire fonctionner ton formulaire de livraison
  const [formData, setFormData] = useState({
    country: 'Morocco',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  })

  // 3. État pour la méthode d'expédition (Gratuite ou Express à 20 dh)
  const [shippingMethod, setShippingMethod] = useState('free')

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Calculs dynamiques pour le résumé du panier
  const subtotal = totalPrice
  const shippingCost = shippingMethod === 'express' ? 20 : 0
  const total = subtotal + shippingCost

  // Si aucun article n'est trouvé, on évite un affichage vide
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-white min-h-screen font-manrope">
        <p className="mb-4 text-gray-500 tracking-wide">Votre panier est vide ou la commande a été validée.</p>
        <button onClick={() => navigate('/')} className="text-xs underline uppercase tracking-wider font-semibold text-gray-900">
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ "client-id": "AXztjcPwmAGuL-dgmOlnxesTeB4a26pCRY3h1T_83yN0gU8B7kdlU2KTfC8lZBk15umtF0Jp21IljMrA", currency: "EUR" }}>
      <main className="min-h-screen bg-white font-manrope text-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* COLONNE GAUCHE : Formulaire & Bouton PayPal (7 cols) */}
          <div className="lg:col-span-7 px-6 md:px-16 py-12 border-r border-gray-100">
            <div className="max-w-[550px] mx-auto space-y-8">
              
              {/* Logo / Nom du site */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <img src="/logo-moroccan-designers.png" alt="Moroccan Designers" className="h-10 object-contain" onError={(e)=>{e.target.style.display='none'}}/>
                <span className="font-serif text-lg tracking-widest uppercase">Moroccan Designers</span>
              </div>

              {/* Section Livraison */}
              <div>
                <h3 className="text-base font-semibold mb-4">Livraison</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Pays/Région</label>
                    <select 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    >
                      <option value="Morocco">Morocco</option>
                      <option value="France">France</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Prénom (facultatif)"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Nom de famille"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Section Méthode d'expédition */}
              <div>
                <h3 className="text-base font-semibold mb-4">Méthode d'expédition</h3>
                <div className="border border-gray-200 rounded overflow-hidden text-xs">
                  <label className={`flex items-center justify-between p-3 cursor-pointer border-b border-gray-100 ${shippingMethod === 'free' ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'free'} 
                        onChange={() => setShippingMethod('free')}
                        className="accent-black"
                      />
                      <span>LIVRAISON GRATUITE AU DESSUS DE 1500 MAD</span>
                    </div>
                    <span className="font-semibold uppercase text-green-600">Gratuit</span>
                  </label>
                  <label className={`flex items-center justify-between p-3 cursor-pointer ${shippingMethod === 'express' ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'express'} 
                        onChange={() => setShippingMethod('express')}
                        className="accent-black"
                      />
                      <span>Expédition accélérée</span>
                    </div>
                    <span className="font-mono">20.00 dh</span>
                  </label>
                </div>
              </div>

              {/* Section Bloc de Paiement PayPal */}
              <div>
                <h3 className="text-base font-semibold mb-4">Paiement</h3>
                <div className="p-4 border border-gray-200 rounded bg-[#fafafa] space-y-4">
                  <p className="text-[11px] text-gray-400">Toutes les transactions sont sécurisées et cryptées par PayPal Sandbox.</p>
                  
                  {isProcessing && (
                    <div className="text-xs text-amber-600 font-semibold animate-pulse uppercase tracking-wider text-center">
                      Validation de la commande en cours...
                    </div>
                  )}

                  <div className={`mt-2 ${isProcessing ? "pointer-events-none opacity-50" : ""}`}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", label: "pay" }}
                      
                      createOrder={async () => {
                        try {
                          // On assemble l'adresse avec les valeurs tapées par l'utilisateur
                          const adresseComplete = `${formData.address}, ${formData.city}, ${formData.country}. Tél: ${formData.phone}`
                      
                          const orderData = {
                            items: items.map((i) => ({
                              product_id: i.id,
                              quantity: i.quantity,
                              price: i.price,
                            })),
                            adresse_livraison: adresseComplete,
                            note: note || '',
                            total: total
                          }
                      
                          const response = await paypalApi.createOrder(orderData)
                          
                          // Ajoute ce console.log pour voir ce que Laravel répond exactement en cas de succès
                          console.log("Réponse Laravel Succès :", response.data)
                      
                          if (response.data && response.data.id) {
                            return response.data.id 
                          } else {
                            throw new Error("Laravel n'a pas renvoyé de champ 'id'")
                          }
                      
                        } catch (err) {
                          // Ce log va afficher TOUT le détail de l'erreur renvoyée par ton contrôleur PHP
                          console.error("Détail complet de l'erreur backend :", err.response?.data)
                          
                          const messageErreur = err.response?.data?.message || "Impossible d'initier le paiement."
                          alert(`Erreur Backend : ${messageErreur}`)
                        }
                      }}
                      onApprove={async (data, actions) => {
                        try {
                            // 1. Appel de capture au backend
                            const response = await api.post(`/orders/${data.orderID}/capture`);
                            
                            // 2. Vérification de la réponse de Laravel
                            if (response.data.status === 'COMPLETED' || response.data.statut === 'paye') {
                                
                                // On vide le panier d'abord
                                clearCart();
                                
                                // Petite alerte sympa
                                alert("Paiement validé avec succès !");
                                
                                // 3. Redirection immédiate vers l'accueil
                                navigate('/', { replace: true });
                            }
                        } catch (error) {
                            console.error("Erreur complète lors de la capture :", error);
                            const msgErreur = error.response?.data?.message || "Erreur lors de la capture.";
                            alert("Détail de l'erreur backend : " + msgErreur);
                        }
                    }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLONNE DROITE : Résumé Dynamique du Panier (5 cols) */}
          <div className="lg:col-span-5 bg-[#fafafa] px-6 md:px-12 py-12">
            <div className="max-w-[420px] mx-auto space-y-6">
              
              {/* Liste des produits récupérés dynamiquement */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white border border-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                        <img 
                          src={item.image_url || item.image || '/placeholder-product.jpg'} 
                          alt={item.name || item.nom} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 line-clamp-2 max-w-[180px]">
                        {item.name || item.nom}
                      </span>
                    </div>
                    <span className="font-mono font-medium">
                      {(Number(item.price) * (item.quantity || 1)).toLocaleString('fr-FR')} dh
                    </span>
                  </div>
                ))}
              </div>

              {/* Notes optionnelles de la commande */}
              {note && (
                <div className="text-[11px] bg-amber-50 border border-amber-100 p-2 rounded text-gray-600">
                  <span className="font-bold">Note : </span>"{note}"
                </div>
              )}

              {/* Code Promo */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Code de réduction ou carte cadeau"
                  className="flex-1 border border-gray-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
                />
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-4 py-2 rounded transition-colors">
                  Appliquer
                </button>
              </div>

              {/* Section des totaux mis à jour en temps réel */}
              <div className="space-y-2 text-xs pt-4 border-t border-gray-200 text-gray-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-mono">{subtotal.toLocaleString('fr-FR')} dh</span>
                </div>
                <div className="flex justify-between">
                  <span>Expédition</span>
                  <span>{shippingCost === 0 ? "Gratuit" : `${shippingCost}.00 dh`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="font-mono text-base">{total.toLocaleString('fr-FR')} dh</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </PayPalScriptProvider>
  )
}