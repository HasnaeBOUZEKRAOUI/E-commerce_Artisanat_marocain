import { Link } from "react-router-dom";
import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";
import img3 from "../../assets/images/img3.png";
import img4 from "../../assets/images/img4.png";

export default function HeroSection() {
  const images = [
    { id: 1, src: img1, alt: "Artisanat 1" },
    { id: 2, src: img2, alt: "Artisanat 2" },
    { id: 3, src: img3, alt: "Artisanat 3" },
    { id: 4, src: img4, alt: "Artisanat 4" },
  ];

  return (
    <section className="relative w-full overflow-hidden border-b border-gray-200">
      {/* Grille de 4 colonnes respectée comme dans ton code */}
      <div className="grid grid-cols-2 md:grid-cols-4 h-[400px] md:h-[450px] gap-1">
        {images.map((img) => (
          <div key={img.id} className="relative overflow-hidden group">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay subtil */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
        ))}
      </div>

      {/* Bouton central avec le Link pour le routage */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Link
          to="/categories/decoration" 
          className="pointer-events-auto bg-white text-black font-manrope font-extrabold text-[14px] md:text-[13px] tracking-[0.2em] px-8 md:px-12 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300 uppercase transform hover:-translate-y-1"
        >
          Shop Morocco's Best Now
        </Link>
      </div>
    </section>
  );
}