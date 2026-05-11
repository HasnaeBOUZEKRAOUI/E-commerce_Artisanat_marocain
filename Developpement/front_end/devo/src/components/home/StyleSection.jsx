export default function StyleSection() {
    return (
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-lg font-bold tracking-widest uppercase text-gray-900 mb-8">
            Choisir par Style
          </h2>
  
          {/* Card style */}
          <div className="relative rounded-xl overflow-hidden bg-white shadow-md flex flex-col md:flex-row min-h-[280px]">
            {/* Texte gauche */}
            <div className="flex flex-col justify-center px-10 py-10 md:w-2/5 z-10 bg-white">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Shop par style</p>
              <h3 className="text-2xl font-black uppercase text-gray-900 mb-4">Modern</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Lorem ipsum dolor sit amet consectetur. Mattis at nisl natoque aliquam. Ullamcorper
                condimentum purus nulla.
              </p>
              <button className="self-start border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white text-xs font-semibold tracking-widest px-5 py-2.5 transition-all duration-300">
                Shop Modern
              </button>
            </div>
  
            {/* Image droite */}
            <div className="md:w-3/5 h-64 md:h-auto relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                alt="Style Modern"
                className="w-full h-full object-cover"
              />
            </div>
  
            {/* Flèches navigation */}
            <button className="absolute left-[37%] bottom-4 z-20 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-amber-50 transition-colors">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button className="absolute right-4 bottom-4 z-20 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-amber-50 transition-colors">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  }