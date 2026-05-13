import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      {/* Icône panier vide */}
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
        <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
        </svg>
      </div>

      <div>
        <p className="text-lg font-bold text-gray-800 mb-1">Votre panier est vide</p>
        <p className="text-sm text-gray-400">Découvrez nos produits artisanaux marocains.</p>
      </div>

      <Link
        to="/"
        className="bg-gray-900 hover:bg-amber-500 text-white text-sm font-bold tracking-widest px-8 py-3 rounded transition-colors duration-300 uppercase"
      >
        Continuer mes achats
      </Link>
    </div>
  );
}