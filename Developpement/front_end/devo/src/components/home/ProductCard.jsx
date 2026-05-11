export default function ProductCard({ img, title, description, price }) {
    return (
      <div className="group flex flex-col gap-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-md bg-gray-100 relative">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Bouton panier au survol */}
          <button className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-semibold tracking-wider px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            + Ajouter
          </button>
        </div>
  
        {/* Infos */}
        <div>
          <p className="text-xs text-gray-500 leading-snug line-clamp-2">{description}</p>
          <p className="text-xs font-bold text-gray-900 mt-1">{price}</p>
        </div>
      </div>
    );
  }