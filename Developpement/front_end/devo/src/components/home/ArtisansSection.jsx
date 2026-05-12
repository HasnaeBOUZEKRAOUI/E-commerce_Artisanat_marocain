import imgCosmetic from "../../assets/images/artisan1.png";
import imgSafia from "../../assets/images/artisan2.png";
import imgDarLhna from "../../assets/images/artisan3.png";

export default function ArtisansSection() {
  const artisans = [
    { name: "COSMETIC", label: "Achetez chez COSMETIC", img: imgCosmetic },
    { name: "SAFIA", label: "Achetez chez SAFIA", img: imgSafia, featured: true },
    { name: "DAR LHNA", label: "Achetez chez DAR LHNA", img: imgDarLhna },
  ];

  return (
    <section className="py-10  bg-white">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Titre Manuale */}
        <h2 className="text-center font-serif text-xs md:text-3xl font-medium tracking-tight text-black mb-10">     Artisans du Mois
        </h2>

        {/* Grille avec images plus étroites */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-12 md:gap-16">
          {artisans.map((artisan) => (
            <div 
              key={artisan.name} 
              className={`flex flex-col items-center transition-all duration-500 ${
                artisan.featured ? "w-full md:w-1/4 z-10" : "w-full md:w-1/4  opacity-90"
              }`}
            >
              {/* Conteneur d'image avec largeur réduite et hauteur importante */}
              <div className={`relative w-full overflow-hidden mb-6 ${
                artisan.featured ? "aspect-[2/3] md:-translate-y-6" : "aspect-[2/3]"
              }`}>
                <img
                  src={artisan.img}
                  alt={artisan.label}
                  className="w-full h-full object-cover shadow-sm"
                />
                
                {/* Petits traits décoratifs (haut et bas) comme sur l'image */}
                {artisan.featured && (
                  <>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-pink-400"></div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-pink-400"></div>
                  </>
                )}
              </div>

              {/* Label en Manrope Bold */}
              <a 
                href="#" 
                className="font-manrope text-[12px] font-bold text-black uppercase tracking-widest text-center hover:text-amber-700 transition-colors"
              >
                {artisan.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}