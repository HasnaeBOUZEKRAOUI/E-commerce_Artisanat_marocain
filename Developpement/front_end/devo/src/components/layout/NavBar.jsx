import { useState } from "react";
import logo from "../../assets/images/logo.png";

export default function NavBar({ onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    "DÉCORATION",
    "FEMMES",
    "HOMMES",
    "SOINS",
    "GASTRONOMIE",
    "PERSONNALISER",
  ];

  return (
    <>
      {/* Bandeau livraison - Noir pur, texte blanc, très espacé */}
      <div className="bg-black text-white text-center py-2.5 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">
        Livraison gratuite limitée pour toute commande de 250€/$
      </div>

      {/* Navbar principale */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px]  px-6 lg:px-10 flex items-center justify-between h-20">
          
          {/* Logo - Ajusté pour ressembler à l'image */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <img 
              src={logo} 
              alt="Moroccan Designers" 
              className="h-12 w-auto object-contain" 
            />
          </div>

          {/* Nav links desktop - Centrés, texte fin et gris foncé */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-[15px] font-fustat tracking-[0.1em] text-black hover:text-amber-700 transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Icônes droite - Loupe, Compte, Panier */}
          <div className="flex items-center gap-5">
            {/* Recherche (Loupe) - Ajouté selon l'image */}
            <button className="text-gray-900 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Compte */}
            <button className="text-gray-900 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Panier */}
            <button 
              onClick={onCartClick}
              className="text-gray-900 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </button>

            {/* Burger mobile */}
            <button
              className="lg:hidden text-gray-900 ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile - Animé */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 shadow-xl">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs font-semibold tracking-widest text-gray-800 uppercase">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}