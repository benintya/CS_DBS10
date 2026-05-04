import { useState, useEffect } from 'react'
import api from '../api/axios'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Food', 'Books', 'Sports']

export default function Items() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const { user } = useAuth()

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/items')
      // handle both { items: [...] } and direct array
      const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []
      setItems(data)
      setFiltered(data)
    } catch (err) {
      setError('Failed to load items. Make sure your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  // Filter + search + sort
  useEffect(() => {
    let result = [...items]
    if (category !== 'All') result = result.filter(i => i.category === category)
    if (search) result = result.filter(i =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase())
    )
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') result.sort((a, b) => a.name?.localeCompare(b.name))
    else result.sort((a, b) => (b.id || 0) - (a.id || 0))
    setFiltered(result)
  }, [items, search, category, sortBy])

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`/items/${id}`)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch {
      alert('Failed to delete item.')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Marketplace</h1>
            <p className="text-slate-400 mt-1">{filtered.length} items available</p>
          </div>
          <Link to="/add-item" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm">
            <span>+</span> List an Item
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍  Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="h-40 bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔌</div>
            <p className="text-red-400 font-medium mb-2">{error}</p>
            <button onClick={fetchItems} className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all text-sm">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">No items found</p>
            <Link to="/add-item" className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all text-sm">
              Be the first to list one!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isOwner={user?.username === item.seller || user?.id === item.user_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
