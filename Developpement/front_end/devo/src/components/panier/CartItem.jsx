export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-gray-200 first:border-t first:border-gray-200">
      <img
        src={item.image}
        alt={item.name}
        className="w-28 h-24 object-cover rounded flex-shrink-0"
      />
 
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 mb-3">{item.name}</p>
 
        {/* Sélecteur quantité */}
        <div className="inline-flex items-center border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="px-3 py-1.5 text-base hover:bg-gray-100 transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="px-4 py-1.5 text-sm border-l border-r border-gray-300 min-w-[36px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-3 py-1.5 text-base hover:bg-gray-100 transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
 
        <button
          onClick={() => onRemove(item.id)}
          className="block mt-2 text-xs text-gray-500 underline hover:text-gray-900 transition-colors cursor-pointer"
        >
          supprimer
        </button>
      </div>
 
      <span className="text-sm font-semibold text-gray-800 pt-1 whitespace-nowrap">
        {item.price.toFixed(2)} dh
      </span>
    </div>
  );
}