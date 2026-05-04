import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
  Electronics: 'from-blue-500 to-cyan-500',
  Fashion: 'from-pink-500 to-rose-500',
  Food: 'from-orange-500 to-amber-500',
  Books: 'from-green-500 to-emerald-500',
  Sports: 'from-purple-500 to-violet-500',
  default: 'from-indigo-500 to-violet-500',
}

const CATEGORY_EMOJI = {
  Electronics: '💻',
  Fashion: '👗',
  Food: '🍜',
  Books: '📚',
  Sports: '⚽',
  default: '📦',
}

export default function ItemCard({ item, onDelete, isOwner }) {
  const gradient = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.default
  const emoji = CATEGORY_EMOJI[item.category] || CATEGORY_EMOJI.default

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="glass-card overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Image / Gradient Banner */}
      <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
        {item.stock !== undefined && item.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">OUT OF STOCK</span>
          </div>
        )}
        {item.category && (
          <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {item.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg leading-tight mb-1 line-clamp-1">{item.name}</h3>
        {item.description && (
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-indigo-400 font-bold text-lg">{formatPrice(item.price)}</p>
            {item.stock !== undefined && (
              <p className="text-slate-500 text-xs">{item.stock} in stock</p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/items/${item.id}`}
              className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm rounded-lg transition-all font-medium"
            >
              View
            </Link>
            {isOwner && (
              <button
                onClick={() => onDelete(item.id)}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-all font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
