import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext }  from "../context/CartContext";
import CartItem            from "../components/cart/CartItem";
import OrderSummary        from "../components/cart/OrderSummary";
import EmptyCart           from "../components/cart/EmptyCart";
import RecentlyViewed      from "../components/subcategory/RecentlyViewed";
import Newsletter          from "../components/home/Newsletter";
import useRecentlyViewed   from "../hooks/useRecentlyViewed";

export default function CartPage() {
  const { items, totalPrice, updateQty, removeItem, clearCart } = useCartContext();
  const { products: recentProducts, loading: recentLoading }    = useRecentlyViewed();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  // ── Appel API Laravel pour créer la commande ─────────────
  const handleCheckout = async (note) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          note,
          total: totalPrice,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la commande");

      const data = await res.json();
      clearCart();
      navigate(`/commande/${data.order_id || "confirmation"}`);
    } catch (err) {
      alert(err.message || "Erreur de commande. Réessayez.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Titre */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-center text-gray-900 uppercase mb-10">
          Panier
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Liste des articles ── */}
            <div className="flex-1 min-w-0">
              {/* En-tête colonne prix */}
              <div className="hidden md:flex justify-end pr-1 mb-1">
                <span className="text-xs text-gray-400 tracking-wider uppercase">Prix</span>
              </div>

              {/* Articles */}
              <div className="border border-gray-100 rounded divide-y divide-gray-100 px-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={updateQty}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* ── Résumé commande ── */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <OrderSummary
                total={totalPrice}
                onCheckout={handleCheckout}
                loading={checkoutLoading}
              />
            </div>
          </div>
        )}

        {/* ── Récemment consulté ── */}
        <div className="mt-16">
          <RecentlyViewed products={recentProducts} loading={recentLoading} />
        </div>
      </div>

      {/* ── Newsletter ── */}
      <Newsletter />
    </main>
  );
}