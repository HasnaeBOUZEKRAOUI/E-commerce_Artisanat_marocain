import icon1 from "../../assets/images/icon1.png";
import icon2 from "../../assets/images/icon2.png";
import icon3 from "../../assets/images/icon3.png";

export default function WhyUs() {
    const features = [
      {
        icon: icon1,
        stat: "2000+ Artisans",
        label: "Découvrez la commande",
      },
      {
        icon: icon2,
        stat: "Valorisez les",
        label: "Communautés",
      },
      {
        icon: icon3,
        stat: "Livraison",
        label: "Mondiale",
      },
    ];
  
    return (
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">
            Pourquoi Achetez Chez Nous
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.stat} className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                 <img src={f.icon} alt="" /> 
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.stat}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }