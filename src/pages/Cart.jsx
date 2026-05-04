import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const updateCart = (updated) => {
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const changeQty = (id, delta) => {
    const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) } : i)
    updateCart(updated)
  }

  const remove = (id) => updateCart(cart.filter(i => i.id !== id))

  const clear = () => updateCart([])

  const total = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0)

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Cart 🛒</h1>
            <p className="text-slate-400 mt-1">{cart.length} item(s)</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clear} className="px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
              Clear all
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-400 text-lg">Your cart is empty</p>
            <Link to="/items" className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all text-sm font-medium">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    <p className="text-indigo-400 text-sm">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white transition-all">−</button>
                    <span className="w-6 text-center text-white font-medium">{item.qty || 1}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white transition-all">+</button>
                  </div>
                  <p className="w-28 text-right font-bold text-white text-sm">{formatPrice(item.price * (item.qty || 1))}</p>
                  <button onClick={() => remove(item.id)} className="text-slate-500 hover:text-red-400 transition-colors ml-2">✕</button>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4 text-slate-400">
                <span>Subtotal ({cart.reduce((s, i) => s + (i.qty || 1), 0)} items)</span>
                <span className="text-white font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <span className="text-slate-400">Shipping</span>
                <span className="text-green-400 text-sm font-medium">Free 🎉</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-indigo-400">{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => { alert('Checkout feature coming soon! 🚀'); }}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
