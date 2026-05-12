import { useState, useEffect } from "react";
import imgStyleModern from "../../assets/images/img5.png";
import imgStyleTradition from "../../assets/images/img6.jpg";

export default function StyleSection() {
  const stylesData = [
    {
      id: 1,
      tag: "Shop par style",
      title: "Modern",
      description: "Découvrez notre interprétation épurée de l'artisanat marocain. Des lignes contemporaines mariées à des textures authentiques.",
      buttonText: "Shop Modern",
      img : imgStyleModern
    },
    {
      id: 2,
      tag: "Shop par style",
      title: "Tradition",
      description: "Le cœur de l'artisanat : des motifs ancestraux, des couleurs terreuses et un savoir-faire transmis de génération en génération.",
      buttonText: "Shop Tradition",
      img: imgStyleTradition
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1); // On gère l'opacité finement
  const currentStyle = stylesData[currentIndex];

  const handleNext = () => {
    setOpacity(0); // 1. On fait disparaître tout le bloc
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stylesData.length); // 2. On change l'index (et donc le côté)
      setOpacity(1); // 3. On fait réapparaître
    }, 400); // Délai de la transition
  };

  const handlePrev = () => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + stylesData.length) % stylesData.length);
      setOpacity(1);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
      <h2 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">          Choisir par Style
        </h2>

        {/* Le conteneur avec transition d'opacité globale pour éviter les sauts de "side" */}
        <div 
          style={{ opacity: opacity, transition: 'opacity 400ms ease-in-out' }}
          className="relative grid grid-cols-1 md:grid-cols-2 min-h-[580px] bg-[#F9F9F9] border border-gray-100 shadow-sm group"
        >
          
          {/* Bloc Texte */}
          <div className={`flex flex-col justify-center px-12 py-16 transition-all duration-0 ${currentIndex % 2 !== 0 ? 'md:order-2' : 'md:order-1'}`}>
            <p className="font-manrope text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-2">{currentStyle.tag}</p>
            <h3 className="font-manrope text-4xl font-[900] uppercase text-black mb-6 tracking-tighter">{currentStyle.title}</h3>
            <p className="font-manrope text-[16px] leading-relaxed text-gray-600 max-w-md mb-10">
              {currentStyle.description}
            </p>
            <button className="self-start font-manrope border-[1.5px] border-black text-black hover:bg-black hover:text-white text-[12px] font-bold tracking-[0.2em] px-10 py-4 rounded-full transition-all duration-300 uppercase">
              {currentStyle.buttonText}
            </button>
          </div>

          {/* Bloc Image */}
          <div className={`relative h-[400px] md:h-auto overflow-hidden ${currentIndex % 2 !== 0 ? 'md:order-1' : 'md:order-2'}`}>
            <img
              src={currentStyle.img}
              alt={currentStyle.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Flèches */}
          <div className="absolute inset-x-0 bottom-8 px-10 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={handlePrev} className="pointer-events-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={handleNext} className="pointer-events-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}