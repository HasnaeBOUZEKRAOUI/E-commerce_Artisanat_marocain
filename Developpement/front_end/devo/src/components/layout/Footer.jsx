import logo from "../../assets/images/LOGO2.png";

import email from "../../assets/icons/Email.png";
import phone from "../../assets/icons/Phone.png";
import chat from "../../assets/icons/Comments.png";

import visa from "../../assets/icons/visa.png";
import mastercard from "../../assets/icons/mastercard.png";
import paypal from "../../assets/icons/paypal.png";
import applepay from "../../assets/icons/pay.png";

import twiter from "../../assets/icons/twiter.png";
import facebook from "../../assets/icons/facebook.png";
import pinterest from "../../assets/icons/p.png";
import instagram from "../../assets/icons/insta.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-0 font-manrope">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-0 items-start">
          
          {/* Section Logo et Contact */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-200 h-auto" />
              
            </div>

            <ul className="space-y-6 text-[13px]">
              <li className="flex items-center gap-4">
                <span className="text-lg">
                  <img src={phone} alt="Phone" className="w-5 h-5" />
                   </span>
                <a href="tel:+212634879821" className="underline underline-offset-4 hover:text-amber-500 tracking-wide">+212-634-87-98-21</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-lg">
                  <img src={email} alt="Email" className="w-5 h-5" />
                </span>
                <a href="#" className="underline underline-offset-4 hover:text-amber-500">Email-Nous</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-lg">
                  <img src={chat} alt="Live Chat" className="w-5 h-5" />
                </span>
                <a href="#" className="underline underline-offset-4 hover:text-amber-500">Live-Chat</a>
              </li>
            </ul>

            <div className="mt-4">
              <p className="text-sm font-bold mb-4">Suivez-nous</p>
              <div className="flex gap-3">
               
                  <a  href="#" className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                    <span className="text-xs">
                      <img src={twiter} alt="" />
                    </span>
                  </a>
                  <a  href="#" className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                    <span className="text-xs">
                      <img src={facebook} alt="" />
                    </span>
                  </a>
                  <a  href="#" className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                    <span className="text-xs">
                      <img src={pinterest} alt="" />
                    </span>
                  </a>
                  <a  href="#" className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                    <span className="text-xs">
                      <img src={instagram} alt="" />
                    </span>
                  </a>
               
              </div>
            </div>
          </div>

          {/* Colonnes de liens avec Manuale */}
          <div>
            <h4 className="text-left font-serif text-xl md:text-xl font-medium tracking-tight text-white mb-10">À PROPOS</h4>
            <ul className="space-y-4 text-[13px] text-gray-300 font-light leading-relaxed">
              <li><a href="#" className="hover:text-white">Qu'est-ce que MOROCCANDESIGNERS?</a></li>
              <li><a href="#" className="hover:text-white">Prêt à vendre sur MOROCCANDESIGNERS?</a></li>
              <li><a href="#" className="hover:text-white">Mon compte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-left font-serif text-xl md:text-xl font-medium tracking-tight text-white mb-10">SERVICE</h4>
            <ul className="space-y-4 text-[13px] text-gray-300 font-light leading-relaxed">
              <li><a href="#" className="hover:text-white">Suivez votre commande</a></li>
              <li><a href="#" className="hover:text-white">Contactez nous</a></li>
              <li><a href="#" className="hover:text-white">Information sur l'expédition</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Politique de retour</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-left font-serif text-xl md:text-xl font-medium tracking-tight text-white mb-10">Les créateurs</h4>
            <ul className="space-y-4 text-[13px] text-gray-300 font-light leading-relaxed">
              <li><a href="#" className="hover:text-white">Artisanat Marocain</a></li>
              <li><a href="#" className="hover:text-white">Connexion Artisan</a></li>
            </ul>
          </div>

          {/* Section Paiement */}
          <div>
            <h4 className="text-center font-serif text-2xl md:text-xl font-medium tracking-tight text-white mb-10">Nous acceptons</h4>
            <div className="grid grid-cols-3 gap-3 max-w-[180px]">
              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-8">
                <img src={visa} alt="Visa" className="max-h-full" />
              </div>
              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-8">
                <img src={mastercard} alt="Mastercard" className="max-h-full" />
              </div>
              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-8">
                <img src={paypal} alt="Paypal" className="max-h-full" />
              </div>
              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-8">
                <img src={applepay} alt="Apple Pay" className="max-h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour en haut */}
        <div className="flex justify-end mb-1">
          <button className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
            <span className="text-white text-lg">↑</span>
          </button>
        </div>
      </div>

      {/* Barre de Copyright blanche */}
      <div className="bg-white py-1 text-black">
        <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:row items-center justify-between text-[12px] font-medium">
          <p>© All Copyright 2026 by HB</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Terms of Use</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}