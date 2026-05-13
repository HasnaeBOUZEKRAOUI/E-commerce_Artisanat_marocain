export default function CartItem({ item }) {
    return (
      <div className="flex items-center gap-6 py-6 border-b border-gray-100">
        {/* Image Produit */}
        <div className="w-24 h-24 bg-gray-50 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
  
        {/* Détails */}
        <div className="flex-1">
          <h3 className="font-fustat text-lg text-gray-800">{item.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            {/* Sélecteur quantité minimaliste */}
            <div className="flex items-center border border-gray-200 rounded px-2 py-1">
              <button className="px-2 text-gray-500">-</button>
              <span className="px-4 text-sm font-bold">{item.quantity}</span>
              <button className="px-2 text-gray-500">+</button>
            </div>
          </div>
          <button className="text-xs text-gray-400 mt-2 hover:text-red-500 transition-colors italic">
            supprimer
          </button>
        </div>
  
        {/* Prix */}
        <div className="text-right">
          <span className="font-bold text-gray-900">{item.price} dh</span>
        </div>
      </div>
    );
  }