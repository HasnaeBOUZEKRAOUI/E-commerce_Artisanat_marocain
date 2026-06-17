// src/pages/CartPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartContext }  from '../context/CartContext'
import CartItem           from '../components/cart/CartItem'
import OrderSummary       from '../components/cart/OrderSummary'
import EmptyCart          from '../components/cart/EmptyCart'
import RecentlyViewed     from '../components/subcategory/RecentlyViewed'
import Newsletter         from '../components/home/Newsletter'
import useRecentlyViewed  from '../hooks/useRecentlyViewed'

export default function CartPage() {
  const { items, totalPrice, updateQty, removeItem, clearCart } = useCartContext()
  const { products: recentProducts, loading: recentLoading }    = useRecentlyViewed()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const navigate = useNavigate()

  const handleCheckout = (note) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }
  
    // On redirige vers la page checkout en passant les infos du panier en arrière-plan (state)
    navigate('/checkoutPage', { 
      state: { 
        items: items,
        totalPrice: totalPrice,
        note: note 
      } 
    })
  }
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-center text-gray-900 uppercase mb-10">
          Panier
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <div className="hidden md:flex justify-end pr-1 mb-1">
                <span className="text-xs text-gray-400 tracking-wider uppercase">Prix</span>
              </div>
              <div className="border border-gray-100 rounded divide-y divide-gray-100 px-4">
                {items.map((item) => (
                  <Link to={`/produits/${item.id}`} key={item.id} className="block">
                  <CartItem key={item.id} item={item} onUpdate={updateQty} onRemove={removeItem} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <OrderSummary total={totalPrice} onCheckout={handleCheckout} loading={checkoutLoading} />
            </div>
          </div>
        )}

        <div className="mt-16">
          <RecentlyViewed products={recentProducts} loading={recentLoading} />
        </div>
      </div>
      <Newsletter />
    </main>
  )
}