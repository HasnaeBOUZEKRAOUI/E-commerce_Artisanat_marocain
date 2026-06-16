import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartContext } from "../context/CartContext"; 
import api from "../api/axios"; 

export default function CheckoutPage() {
  const { cartItems, getCartTotal } = useCartContext(); 

  // Formulaire de livraison
  const [formData, setFormData] = useState({
    country: "Morocco",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState("free"); // 'free' ou 'express'
  const shippingCost = shippingMethod === "express" ? 20 : 0;
  
  const subtotal = getCartTotal ? getCartTotal() : 2000; 
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "TON_CLIENT_ID_SANDBOX_PAYPAL", currency: "EUR" }}>
      <main className="min-h-screen bg-white font-manrope text-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          <div className="lg:col-span-7 px-6 md:px-16 py-12 border-r border-gray-100">
            <div className="max-w-[550px] mx-auto space-y-8">
              
              <div className="flex justify-center lg:justify-start mb-6">
                <img src="/logo-moroccan-designers.png" alt="Moroccan Designers" className="h-10 object-contain" onError={(e)=>{e.target.style.display='none'}}/>
                <span className="font-serif text-lg tracking-widest uppercase">Moroccan Designers</span>
              </div>

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
                      <span>LIVRAISON GRATUITE</span>
                    </div>
                    <span className="font-semibold uppercase">Gratuit</span>
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

              <div>
                <h3 className="text-base font-semibold mb-4">Paiement</h3>
                <div className="p-4 border border-gray-200 rounded bg-[#fafafa] space-y-4">
                  <p className="text-[11px] text-gray-400">Toutes les transactions sont sécurisées et cryptées par PayPal Sandbox.</p>
                  
                  <div className="mt-2">
                    <PayPalButtons
                      style={{ layout: "vertical", label: "pay" }}
                      disabled={!formData.lastName || !formData.address || !formData.city}
                      createOrder={async () => {
                        try {
                          // 1. Demande au backend Laravel de créer la commande PayPal
                          const response = await api.post("/orders/create", {
                            cart: cartItems,
                            shipping_cost: shippingCost,
                            shipping_details: formData
                          });
                          return response.data.id; // Renvoie l'ID de commande PayPal généré
                        } catch (err) {
                          console.error("Erreur création commande :", err);
                          alert("Impossible d'initier le paiement.");
                        }
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          // 2. Le paiement a été validé par l'acheteur sur la popup, on le capture côté Laravel
                          const response = await api.post(`/orders/${data.orderID}/capture`);
                          if (response.data.status === "COMPLETED") {
                            alert("Commande validée avec succès ! Merci de votre achat (Test).");
                            // Redirige vers une page de succès ou vide le panier ici
                          }
                        } catch (err) {
                          console.error("Erreur capture paiement :", err);
                          alert("Le paiement a échoué lors de la validation.");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLONNE DROITE : Résumé du Panier (5 cols) */}
          <div className="lg:col-span-5 bg-[#fafafa] px-6 md:px-12 py-12">
            <div className="max-w-[420px] mx-auto space-y-6">
              
              {/* Liste des produits */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cartItems && cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white border border-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover"/>
                        <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 line-clamp-2 max-w-[180px]">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium">{Number(item.price).toLocaleString('fr-FR')} dh</span>
                  </div>
                ))}
              </div>

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

              {/* Totaux */}
              <div className="space-y-2 text-xs pt-4 border-t border-gray-200 text-gray-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-mono">{subtotal.toLocaleString('fr-FR')} dh</span>
                </div>
                <div className="flex justify-between">
                  <span>Expédition</span>
                  <span>{shippingCost === 0 ? "Gratuit" : `${shippingCost} dh`}</span>
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
  );
}