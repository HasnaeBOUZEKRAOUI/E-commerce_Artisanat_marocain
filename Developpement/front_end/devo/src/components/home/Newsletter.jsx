export default function Newsletter() {
    return (
      <section className="py-16 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">
            Abonnez-vous
          </h2>
  
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="flex-1 w-full px-5 py-3.5 rounded-sm bg-white text-gray-800 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm tracking-widest px-6 py-3.5 rounded-sm transition-colors duration-300 uppercase">
              S'Abonner
            </button>
          </div>
        </div>
      </section>
    );
  }