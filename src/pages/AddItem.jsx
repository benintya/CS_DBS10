import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['Electronics', 'Fashion', 'Food', 'Books', 'Sports', 'Other']

export default function AddItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.price) { setError('Name and price are required.'); return }
    setLoading(true)
    try {
      await api.post('/items', {
        ...form,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : undefined,
      })
      navigate('/items')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link to="/items" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          ← Back to marketplace
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-3 shadow-lg shadow-indigo-500/30">
            <span className="text-2xl">📤</span>
          </div>
          <h1 className="text-2xl font-bold text-white">List an Item</h1>
          <p className="text-slate-400 text-sm mt-1">Fill in details to put your item on the marketplace</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Item Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. iPhone 15 Pro" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your item..." rows={3} className="input-field resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Price (IDR) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" min="0" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" min="0" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Preview price */}
            {form.price && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-slate-400 text-xs">Price preview</p>
                <p className="text-indigo-400 font-bold text-lg">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(form.price)}
                </p>
              </div>
            )}

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Listing item...
                </span>
              ) : '✅ List Item for Sale'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
