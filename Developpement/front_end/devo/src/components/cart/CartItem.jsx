/**
 * CartItem
 * @param {object} item      – { id, name, image_url, price, quantity }
 * @param {func}   onUpdate  – (id, qty) => void
 * @param {func}   onRemove  – (id) => void
 */
export default function CartItem({ item, onUpdate, onRemove }) {
    return (
      <div className="flex items-start gap-4 py-5 border-b border-gray-100 last:border-b-0">
  
        {/* Image */}
        <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
          <img
            src={item.image_url || "https://placehold.co/96x80/f5f5f5/aaa?text=Produit"}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://placehold.co/96x80/f5f5f5/aaa?text=Produit"; }}
          />
        </div>
  
        {/* Détails */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{item.name}</p>
  
          {/* Contrôle quantité */}
          <div className="flex items-center gap-0">
            <button
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors text-sm font-bold"
            >
              −
            </button>
            <span className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center text-sm font-medium text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold"
            >
              +
            </button>
          </div>
  
          {/* Supprimer */}
          <button
            onClick={() => onRemove(item.id)}
            className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors underline-offset-2 hover:underline"
          >
            supprimer
          </button>
        </div>
  
        {/* Prix */}
        <div className="flex-shrink-0 text-sm font-bold text-gray-900 whitespace-nowrap">
          {(item.price * item.quantity).toFixed(2)} dh
        </div>
      </div>
    );
  }