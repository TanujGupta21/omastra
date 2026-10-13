import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, Tag, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useState } from 'react'
import QuantitySelector from '../../components/ui/QuantitySelector'
import { formatPrice, calcShipping } from '../../lib/utils'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import EmptyState from '../../components/ui/EmptyState'

export default function CartPage() {
  const { items, removeItem, updateQty, itemCount } = useCart()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = items.reduce((sum, item) => {
    const price = item.variantId
      ? (item.product?.variants?.find(v => String(v._id) === String(item.variantId))?.price || 0)
      : (item.price || item.variant?.price || 0)
    return sum + price * (item.quantity || 1)
  }, 0)

  const discount = appliedCoupon?.discount || 0
  const shipping = calcShipping(subtotal - discount)
  const total = Math.max(0, subtotal - discount + shipping)

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/api/v1/coupons/validate', {
        code: coupon.toUpperCase(),
        subtotal,
      })
      setAppliedCoupon(data.data)
      toast.success(`Coupon applied! You save ${formatPrice(data.data.discount)}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCoupon('')
  }

  if (itemCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some supplements to get started on your next level."
          action={{ label: 'Shop Supplements', href: '/shop' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wide text-black">Shopping Cart ({itemCount})</h1>
        <Link to="/shop" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => {
            const productId = item.product?._id || item.product
            const variantId = item.variantId
            const variant = item.product?.variants?.find(v => String(v._id) === String(variantId)) || item.variant
            const price = variant?.price || item.price || 0
            const image = item.product?.images?.[0]?.url || `https://placehold.co/100x100/EFF6FF/2563EB?text=OMASTRA`
            const name = item.product?.name || item.productName || 'Product'
            const slug = item.product?.slug || ''
            const itemKey = item._id || item.key || `${productId}-${variantId}-${idx}`

            return (
              <div key={itemKey} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all duration-200">
                <Link to={`/products/${slug}`} className="flex-shrink-0">
                  <img
                    src={image}
                    alt={name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/products/${slug}`} className="text-sm font-semibold text-black hover:text-black transition-colors block truncate">
                        {name}
                      </Link>
                      {variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[variant.flavor, variant.size].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(itemKey)}
                      className="text-gray-300 hover:text-black transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      value={item.quantity}
                      min={1}
                      max={variant?.stock || 99}
                      onChange={(qty) => updateQty(itemKey, qty)}
                      size="sm"
                    />
                    <p className="font-bold text-black">{formatPrice(price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-black mb-5 text-lg">Order Summary</h2>

            {/* Coupon */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-black" />
                  <span className="text-sm font-semibold text-black">{appliedCoupon.code}</span>
                </div>
                <button onClick={removeCoupon} className="text-gray-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 input-field text-sm py-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-black hover:text-black transition-all duration-200 disabled:opacity-40"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-black">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-black">
                  <span>Coupon discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-black font-semibold' : 'text-black'}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">Add {formatPrice(999 - (subtotal - discount))} more for free shipping</p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-black">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-5 w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 text-base hover:-translate-y-0.5 active:translate-y-0"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Final prices confirmed at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


