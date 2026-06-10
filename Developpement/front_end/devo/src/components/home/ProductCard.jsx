export default function ProductCard({ img, description, price, onAdd }) {
  return (
    <div className="group flex flex-col gap-3">
      {/* Image container */}
      <div className="aspect-square overflow-hidden border border-gray-300 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-[60px] relative bg-white p-2">
        <img
          src={img}
          alt="Produit"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        />

        {/* Bouton panier */}
        <button
          onClick={onAdd}   // ✅ ICI connexion au cart
          className="absolute bottom-4 right-4 bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Infos produit */}
      <div className="px-1">
        <p className="font-manrope text-[13px] text-gray-800 leading-relaxed line-clamp-3 mb-1">
          {description}
        </p>
        <p className="font-manrope text-[14px] font-black text-black">
          {price}
        </p>
      </div>
    </div>
  );
}