import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => {
        const data = res.data.item || res.data
        setItem(data)
        setForm(data)
      })
      .catch(() => setError('Item not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/items/${id}`, form)
      setItem(form)
      setEditing(false)
    } catch {
      alert('Failed to update item.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await api.delete(`/items/${id}`)
      navigate('/items')
    } catch {
      alert('Failed to delete.')
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(c => c.id === item.id)
    if (existing) existing.qty = (existing.qty || 1) + 1
    else cart.push({ ...item, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart! 🛒')
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-red-400">{error}</p>
        <Link to="/items" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">← Back to marketplace</Link>
      </div>
    </div>
  )

  const isOwner = user?.username === item?.seller || user?.id === item?.user_id

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/items" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          ← Back to marketplace
        </Link>

        <div className="glass-card overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
            <span className="text-8xl">📦</span>
          </div>

          <div className="p-8">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Edit Item</h2>
                {['name', 'description', 'price', 'stock', 'category'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">{field}</label>
                    <input
                      type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                      value={form[field] || ''}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="input-field"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{item.name}</h1>
                    {item.category && (
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full">{item.category}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-400">{formatPrice(item.price)}</p>
                    {item.stock !== undefined && <p className="text-slate-500 text-sm">{item.stock} in stock</p>}
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-300 mb-6 leading-relaxed">{item.description}</p>
                )}

                {item.seller && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold">
                      {item.seller?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Sold by</p>
                      <p className="text-white font-medium">{item.seller}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={addToCart}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    🛒 Add to Cart
                  </button>
                  {isOwner && (
                    <>
                      <button onClick={() => setEditing(true)} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">
                        ✏️ Edit
                      </button>
                      <button onClick={handleDelete} className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all">
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
