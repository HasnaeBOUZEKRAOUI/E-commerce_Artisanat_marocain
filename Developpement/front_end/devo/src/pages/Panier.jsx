import { useState } from "react";
import Footer from "../components/layout/Footer";
import Newsletter from "../components/home/Newsletter";
import ProductCard from "../components/home/ProductCard";
import CartItem from "../components/panier/CartItem";
import CartSummary from "../components/panier/CartSummary";

const initialCartItems = [
  {
    id: 1,
    name: "Tapis Marocain Traditionnel",
    price: 450,
    quantity: 1,
    image: "https://via.placeholder.com/150?text=Tapis+1",
  },
  {
    id: 2,
    name: "Lampe Tadjine",
    price: 280,
    quantity: 2,
    image: "https://via.placeholder.com/150?text=Lampe",
  },
];

const recentlyViewed = [
  {
    name: "Lanterne Marocaine",
    price: 350,
    image: "https://via.placeholder.com/150?text=Lanterne",
  },
  {
    name: "Tajine Décorateur",
    price: 200,
    image: "https://via.placeholder.com/150?text=Tajine",
  },
  {
    name: "Babouche Artisanale",
    price: 150,
    image: "https://via.placeholder.com/150?text=Babouche",
  },
  {
    name: "Plateau en Cuivre",
    price: 320,
    image: "https://via.placeholder.com/150?text=Plateau",
  },
];

export default function Panier() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [note, setNote] = useState("");
 
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };
 
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
 
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
 
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
 
      {/* ════ PANIER ════ */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        <h1 className="text-center text-3xl font-bold tracking-widest mb-10 text-gray-900">
          PANIER
        </h1>
 
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Articles */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <p className="italic text-gray-400 py-6">Votre panier est vide.</p>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>
 
          {/* Résumé */}
          <CartSummary total={total} note={note} onNoteChange={setNote} />
        </div>
      </section>
 
      {/* ════ RÉCEMMENT CONSULTÉ ════ */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-900">
          RÉCEMMENT CONSULTÉ
        </h2>
 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {recentlyViewed.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>
 
      <Newsletter />
      <Footer />
    </div>
  );
}