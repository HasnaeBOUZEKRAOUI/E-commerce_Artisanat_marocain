export default function CategoriesSection() {
  const categories = [
    { name: "Bougies", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
    { name: "Tapis", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { name: "Huiles corporelles", img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80" },
    { name: "Coussins décoratifs", img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80" },
    { name: "Décoration murale", img: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=400&q=80" },
    { name: "Sacs", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
  ];

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2">
        
        <h2 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">
          Catégories Populaires
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-0 gap-x-0">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="flex flex-col items-center group"
            >
              {/* Cercle avec bordure double ou marquée */}
              <div className="relative w-28 h-28 md:w-30 md:h-30 rounded-full border-[1.5px] transition-all duration-500 group-hover:border-black shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              <span className="mt-6 font-manrope text-[14px] md:text-[15px] font-bold text-gray-900 text-center uppercase tracking-widest group-hover:text-amber-700 transition-colors">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}