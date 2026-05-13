export default function SubCategoryBar({ subcategories = [], activeSlug, onSelect }) {
    // On double la liste pour créer l'effet d'infini
    const loopedSubcategories = [...subcategories, ...subcategories];
  
    return (
      <div className="w-full overflow-hidden bg-white py-1 border-b border-gray-50">
        {/* Conteneur principal qui cache le débordement */}
        <div className="relative flex overflow-hidden group">
          
          {/* Le conteneur animé */}
          <div className="animate-infinite-scroll flex gap-12 px-6">
            {loopedSubcategories.map((sub, index) => {
              const isActive = sub.slug === activeSlug;
              return (
                <button
                  key={`${sub.id}-${index}`}
                  onClick={() => onSelect(sub.slug)}
                  className="flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  {/* Cercle image */}
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden transition-all
                      ${isActive
                        ? "ring-2 ring-amber-500 ring-offset-2 shadow-md"
                        : "ring-1 ring-gray-100 group-hover:ring-amber-200"
                      }`}
                  >
                    <img
                      src={sub.image_url}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/96x96/f5f5f5/aaa?text=IMG";
                      }}
                    />
                  </div>
  
                  {/* Nom - Stylisé pour ton projet d'artisanat */}
                  <span
                    className={`text-[10px] md:text-xs font-bold tracking-widest text-center leading-tight uppercase transition-colors
                      ${isActive ? "text-amber-600" : "text-gray-500 hover:text-amber-500"}`}
                  >
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }