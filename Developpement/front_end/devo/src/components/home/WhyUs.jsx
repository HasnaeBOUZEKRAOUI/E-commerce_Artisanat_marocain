export default function WhyUs() {
    const features = [
      {
        icon: (
          <svg className="w-10 h-10 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        ),
        stat: "2000+ Artisans",
        label: "Découvrez la commande",
      },
      {
        icon: (
          <svg className="w-10 h-10 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
        ),
        stat: "Valorisez les",
        label: "Communautés",
      },
      {
        icon: (
          <svg className="w-10 h-10 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253"/>
          </svg>
        ),
        stat: "Livraison",
        label: "Mondiale",
      },
    ];
  
    return (
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-lg font-bold tracking-widest uppercase text-gray-900 mb-12">
            Pourquoi Achetez Chez Nous
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.stat} className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.stat}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }