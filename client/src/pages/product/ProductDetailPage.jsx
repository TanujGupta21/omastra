import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Heart, ShoppingCart, Package, RefreshCw, Shield } from 'lucide-react'
import api from '../../lib/api'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import ProductImageGallery from '../../components/product/ProductImageGallery'
import NutritionFacts from '../../components/product/NutritionFacts'
import ReviewCard from '../../components/product/ReviewCard'
import ReviewForm from '../../components/product/ReviewForm'
import RelatedProducts from '../../components/product/RelatedProducts'
import Rating from '../../components/ui/Rating'
import QuantitySelector from '../../components/ui/QuantitySelector'
import PriceDisplay from '../../components/ui/PriceDisplay'
import { Skeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { cn } from '../../lib/utils'

const TABS = ['Description', 'Nutrition', 'Reviews']

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('Description')
  const [adding, setAdding] = useState(false)

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/products/slug/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/reviews/product/${slug}`)
      return data
    },
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <ErrorState title="Product not found" description="This product may no longer be available." onRetry={refetch} />
      </div>
    )
  }

  const variant = product.variants?.[selectedVariantIdx]
  const wishlisted = isWishlisted(product._id)
  const reviews = Array.isArray(reviewsData?.data) ? reviewsData.data : (Array.isArray(reviewsData) ? reviewsData : [])
  const inStock = (variant?.stock || 0) > 0

  const handleAddToCart = async () => {
    if (!inStock) return
    setAdding(true)
    await addItem(product, variant, quantity)
    setAdding(false)
  }

  const groupedByFlavor = {}
  product.variants?.forEach((v, i) => {
    const key = v.flavor || 'Standard'
    if (!groupedByFlavor[key]) groupedByFlavor[key] = []
    groupedByFlavor[key].push({ ...v, idx: i })
  })

  const uniqueFlavors = Object.keys(groupedByFlavor)
  const currentFlavor = variant?.flavor || 'Standard'
  const sizesForFlavor = groupedByFlavor[currentFlavor] || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/shop" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/categories/${product.category.slug}`} className="hover:text-black transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-black truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Details */}
        <div>
          {product.category && (
            <Link
              to={`/categories/${product.category.slug}`}
              className="text-xs text-gray-500 font-semibold uppercase tracking-wider hover:text-black transition-colors mb-2 block"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-black mb-3">{product.name}</h1>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Rating value={product.averageRating} />
              <span className="text-sm text-gray-500">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {variant && (
            <div className="mb-6">
              <PriceDisplay price={variant.price} originalPrice={variant.originalPrice} size="lg" />
            </div>
          )}

          {/* Stock */}
          <div className="mb-6">
            {!variant ? (
              <span className="text-gray-500 text-sm">Select a variant</span>
            ) : variant.stock === 0 ? (
              <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
            ) : variant.stock <= 10 ? (
              <span className="text-gray-600 text-sm font-semibold">Only {variant.stock} left!</span>
            ) : (
              <span className="text-black text-sm font-semibold">✓ In Stock</span>
            )}
          </div>

          {/* Flavor selector */}
          {uniqueFlavors.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-black mb-2">
                Flavour: <span className="text-black">{currentFlavor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {uniqueFlavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => {
                      const idx = groupedByFlavor[flavor][0]?.idx ?? 0
                      setSelectedVariantIdx(idx)
                    }}
                    className={cn(
                      'px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200',
                      currentFlavor === flavor
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-500 hover:border-black bg-white hover:text-black'
                    )}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizesForFlavor.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-black mb-2">
                Size: <span className="text-black">{variant?.size}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizesForFlavor.map((v) => (
                  <button
                    key={v.idx}
                    onClick={() => setSelectedVariantIdx(v.idx)}
                    className={cn(
                      'px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200',
                      selectedVariantIdx === v.idx
                        ? 'border-black bg-black text-white'
                        : v.stock === 0
                        ? 'border-gray-100 text-gray-300 line-through cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-500 hover:border-black bg-white hover:text-black'
                    )}
                    disabled={v.stock === 0}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-black mb-2">Quantity</p>
            <QuantitySelector
              value={quantity}
              min={1}
              max={variant?.stock || 99}
              onChange={setQuantity}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all',
                inStock
                  ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {!inStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggle(product)}
              className={cn(
                'w-14 flex items-center justify-center rounded-xl border transition-all duration-200',
                wishlisted
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black'
              )}
            >
              <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Shipping info */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200">
            {[
              { icon: Package, label: 'Free Shipping', sub: 'Above ₹999' },
              { icon: RefreshCw, label: '7-Day Returns', sub: 'Sealed products' },
              { icon: Shield, label: 'Lab Tested', sub: 'Every batch' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-black mx-auto mb-1" />
                <p className="text-xs font-semibold text-black">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 pt-10 mb-16">
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors',
                tab === t
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              )}
            >
              {t} {t === 'Reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {tab === 'Description' && (
          <div className="max-w-3xl">
            {product.shortDescription && (
              <p className="text-gray-500 mb-4 leading-relaxed">{product.shortDescription}</p>
            )}
            {product.description && (
              <div
                className="prose prose-sm max-w-none text-gray-500 [&_p]:mb-3 [&_strong]:text-black [&_h3]:text-black [&_ul]:text-gray-500"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {product.directions && (
              <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-black mb-2 text-sm">Directions</h4>
                <p className="text-sm text-gray-500">{product.directions}</p>
              </div>
            )}
            {product.allergens && (
              <div className="mt-3 p-5 rounded-2xl bg-gray-100 border border-gray-200">
                <h4 className="font-bold text-black mb-1 text-sm">⚠ Allergens</h4>
                <p className="text-sm text-gray-500">{product.allergens}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'Nutrition' && (
          <div className="max-w-md">
            {product.nutritionFacts ? (
              <NutritionFacts data={product.nutritionFacts} />
            ) : (
              <p className="text-gray-500 text-sm">Nutrition information not available.</p>
            )}
            {product.ingredients && (
              <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-black mb-2 text-sm">Ingredients</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{product.ingredients}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'Reviews' && (
          <div className="max-w-3xl">
            <ReviewForm productSlug={slug} />
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm mt-6">No approved reviews yet.</p>
            ) : (
              <div className="space-y-4 mt-8">
                {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related */}
      <RelatedProducts productSlug={slug} categoryId={product.category?._id} />
    </div>
  )
}


