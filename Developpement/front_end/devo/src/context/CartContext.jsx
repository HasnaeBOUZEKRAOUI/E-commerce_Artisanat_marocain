import { createContext, useContext } from "react";
import useCart from "../hooks/useCart";

const CartContext = createContext(null);

/**
 * CartProvider – à envelopper dans App.jsx autour de <BrowserRouter>
 *
 * Usage dans n'importe quel composant :
 *   const { items, addItem, totalPrice } = useCartContext();
 */
export function CartProvider({ children }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext doit être utilisé dans <CartProvider>");
  return ctx;
}