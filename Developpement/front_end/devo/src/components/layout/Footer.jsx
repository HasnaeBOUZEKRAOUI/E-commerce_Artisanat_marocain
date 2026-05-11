export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 pt-14 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Colonnes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + Contact */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span className="font-bold text-sm text-white tracking-wider uppercase">
                  Moroccan<span className="text-amber-500">Designers</span>
                </span>
              </div>
  
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                  </svg>
                  +212-634-97-98-21
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                  </svg>
                  Email-Nous
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
                  </svg>
                  Live-Chat
                </li>
              </ul>
  
              {/* Réseaux sociaux */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suivez-nous</p>
                <div className="flex gap-2">
                  {["F", "in", "ig", "YT"].map((s) => (
                    <a key={s} href="#" className="w-7 h-7 bg-gray-700 hover:bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
  
            {/* À propos */}
            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-4">À Propos</h4>
              <ul className="space-y-2 text-xs">
                {["Qui que nous sommes", "Prêt à vendre sur MOROCCANDESIGNERS", "Mon compte"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-amber-400 transition-colors leading-relaxed">{item}</a></li>
                ))}
              </ul>
            </div>
  
            {/* Service clientèle */}
            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-4">Service à la Clientèle</h4>
              <ul className="space-y-2 text-xs">
                {["Suivre votre commande", "Contactez-nous", "Réclamation sur l'expédition", "FAQ", "Politique de retour"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-amber-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
  
            {/* Les créateurs + Paiements */}
            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-4">Les Créateurs</h4>
              <ul className="space-y-2 text-xs mb-6">
                {["Artisanat Marocain", "Connexion Artisan"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-amber-400 transition-colors">{item}</a></li>
                ))}
              </ul>
  
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Nous Acceptons</h4>
              <div className="flex gap-2 flex-wrap">
                {["VISA", "MC", "PP"].map((p) => (
                  <span key={p} className="bg-gray-700 text-gray-300 text-[10px] font-bold px-2 py-1 rounded">{p}</span>
                ))}
              </div>
            </div>
          </div>
  
          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© Art Copyright 2026 by MB</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors">Term of Use</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }