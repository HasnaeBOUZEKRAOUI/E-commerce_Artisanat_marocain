import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Newsletter from "../components/home/Newsletter"; // Dans ton dossier accueil

const dummyItems = [
  { id: 1, name: "Bracelet Lorem ipsum dolor", price: "200,99", quantity: 6, image: "/path/to/img" },
  { id: 2, name: "Colier Lorem ipsum dolor", price: "200,99", quantity: 4, image: "/path/to/img" },
];

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-manrope font-bold text-center mb-16 tracking-widest uppercase italic">
          Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Liste des produits (Gauche) */}
          <div className="lg:col-span-2">
            {dummyItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="mt-20">
              <h2 className="text-2xl font-bold tracking-widest uppercase mb-10 italic">
                Récemment consulté
              </h2>
              {/* Tu peux réutiliser ton composant de grille produit ici */}
            </div>
          </div>

          {/* Résumé (Droite) */}
          <CartSummary total="2000,00" />
        </div>
      </div>
      
      <Newsletter />
    </div>
  );
}