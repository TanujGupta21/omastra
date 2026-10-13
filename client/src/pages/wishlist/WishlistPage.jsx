import { Heart, ShoppingCart } from 'lucide-react'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import { getProductImage, formatPrice } from '../../lib/utils'

export default function WishlistPage() {
  const { items, toggle } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and come back to them later."
          action={{ label: 'Browse Products', href: '/shop' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display uppercase tracking-wide text-black mb-8">Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((product) => {
          const p = product.product || product
          const variant = p.variants?.[0]
          const price = variant?.price || p.price
          const image = getProductImage(p)

          return (
            <div key={p._id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-colors">
              <Link to={`/products/${p.slug}`} className="block relative aspect-square overflow-hidden">
                <img src={image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={(e) => { e.preventDefault(); toggle(p) }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </Link>
              <div className="p-4">
                <Link to={`/products/${p.slug}`} className="text-sm font-semibold text-black hover:text-black line-clamp-2 transition-colors block mb-2">
                  {p.name}
                </Link>
                {price && <p className="text-gray-500 font-bold mb-3">{formatPrice(price)}</p>}
                <button
                  onClick={() => addItem(p, variant)}
                  disabled={!variant || variant.stock === 0}
                  className="w-full py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-black-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-black/10"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {variant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


