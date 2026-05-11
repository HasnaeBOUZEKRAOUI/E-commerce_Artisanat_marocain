export default function ArtisansSection() {
    const artisans = [
      {
        name: "COSMETIC",
        label: "Achetez chez COSMETIC",
        img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
      },
      {
        name: "SAFIA",
        label: "Achetez chez SAFIA",
        img: "https://images.unsplash.com/photo-1620906600925-2bfb31e8dd46?w=500&q=80",
        featured: true,
      },
      {
        name: "DAR LHNA",
        label: "Achetez chez DAR LHNA",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
      },
    ];
  
    return (
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-lg font-bold tracking-widest uppercase text-gray-900 mb-10">
            Artisans du Mois
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {artisans.map((artisan) => (
              <a
                key={artisan.name}
                href="#"
                className={`group flex flex-col gap-3 ${artisan.featured ? "md:-mt-8" : ""}`}
              >
                {/* Image */}
                <div
                  className={`overflow-hidden rounded-lg shadow-md ${
                    artisan.featured ? "h-72" : "h-56"
                  }`}
                >
                  <img
                    src={artisan.img}
                    alt={artisan.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Label */}
                <p className="text-xs font-semibold text-center text-gray-700 tracking-wide group-hover:text-amber-500 transition-colors">
                  {artisan.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }