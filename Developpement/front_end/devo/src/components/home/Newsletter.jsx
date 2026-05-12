export default function Newsletter() {
  return (
    <section className="py-10 bg-[#EEEEEE]"> {/* Fond gris clair */}
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Titre avec la police Manuale */}
        <h2 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">
          Abonnez-vous
        </h2>

        {/* Conteneur de l'input style "Pilule" */}
        <div className="relative max-w-xl mx-auto flex items-center bg-black rounded-full overflow-hidden p-1 shadow-sm">
          
          <input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            className="flex-1 bg-black text-white text-sm px-8 py-4 outline-none placeholder-gray-400 font-manrope"
          />
          
          {/* Bouton blanc contrasté */}
          <button className="bg-white text-black font-manrope font-bold text-sm px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300">
            S'Abonner
          </button>
        </div>

      </div>
    </section>
  );
}