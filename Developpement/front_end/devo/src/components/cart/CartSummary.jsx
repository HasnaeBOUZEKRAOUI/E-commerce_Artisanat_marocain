export default function CartSummary({ total }) {
    return (
      <div className="bg-gray-50 p-8 rounded-sm h-fit">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Ajouter une note de commande</h2>
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <span className="text-lg font-medium">Total :</span>
          <span className="text-xl font-bold">{total}dh</span>
        </div>
  
        <div className="flex flex-col gap-4">
          {/* Badge cadeaux - Info visuelle */}
          <div className="border border-black text-center py-3 rounded-full text-sm font-medium">
            De nombreux cadeaux à gagner !
          </div>
  
          {/* Bouton Vérifier (Noir) */}
          <button className="bg-[#1a1a1a] text-white py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-black transition-all">
            vérifier
          </button>
  
          {/* Bouton Continuer (Blanc) */}
          <button className="bg-white border border-gray-200 text-black py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all shadow-sm">
            continuer vos achats
          </button>
        </div>
      </div>
    );
  }