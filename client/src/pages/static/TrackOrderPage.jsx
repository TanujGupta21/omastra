import { useState } from 'react'
import { Search, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react'
import api from '../../lib/api'

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: Clock },
  { key: 'confirmed', label: 'Confirmed',      icon: CheckCircle2 },
  { key: 'processing',label: 'Processing',     icon: Package },
  { key: 'shipped',   label: 'Shipped',        icon: Truck },
  { key: 'delivered', label: 'Delivered',      icon: CheckCircle2 },
]

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function StatusTimeline({ status }) {
  const currentIdx = STATUS_ORDER.indexOf(status)
  const isCancelled = status === 'cancelled'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-400">Order Cancelled</p>
          <p className="text-xs text-gray-500 mt-0.5">This order has been cancelled. Contact support if unexpected.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
      <div
        className="absolute left-5 top-5 w-0.5 bg-black transition-all duration-700"
        style={{ height: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
      />
      <div className="space-y-6">
        {STATUS_STEPS.map(({ key, label, icon: Icon }, idx) => {
          const done = idx <= currentIdx
          const active = idx === currentIdx
          return (
            <div key={key} className="flex items-center gap-4 relative">
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                done ? 'bg-black text-white shadow-md shadow-black/15' : 'bg-white border border-gray-200 text-gray-500'
              } ${active ? 'ring-2 ring-black ring-offset-2 ring-offset-bg' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-semibold text-sm ${done ? 'text-black' : 'text-gray-500'}`}>{label}</p>
                {active && <p className="text-xs text-black mt-0.5 animate-pulse">Current status</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)

export default function TrackOrderPage() {
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      try {
        const { data } = await api.get('/api/v1/orders/track', {
          params: { orderNumber: query.trim().toUpperCase(), email: email.trim() || undefined },
        })
        if (data?.data) {
          setOrder(data.data)
          return
        }
      } catch {}

      try {
        const saved = JSON.parse(localStorage.getItem('omastra_orders') || '[]')
        const targetNum = query.trim().toUpperCase()
        const found = saved.find(
          (o) =>
            o.orderNumber?.toUpperCase() === targetNum ||
            o._id === targetNum ||
            o.id === targetNum
        )
        if (found) {
          setOrder(found)
          return
        }
      } catch {}

      setError('Order not found. Please check your order reference number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Order Tracking</p>
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wide text-black mb-3">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number to see real-time status updates.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="card p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Order Number <span className="text-red-400">*</span>
            </label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. OM-20241012-0001"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Email <span className="text-gray-500 text-xs">(for guest orders)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-black-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-black/15"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Order result */}
      {order && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                <p className="font-bold text-black text-lg">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                <p className="font-semibold text-black text-sm">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment</p>
                <p className="font-medium text-black capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                <p className="font-bold text-black">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-black mb-6">Delivery Status</h2>
            <StatusTimeline status={order.fulfillmentStatus} />
          </div>

          {order.shippingAddress && (
            <div className="card p-5">
              <h3 className="font-semibold text-black mb-3">Delivering To</h3>
              <p className="text-sm text-black">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},&nbsp;
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-sm text-gray-500 mt-1">📞 {order.shippingAddress.phone}</p>
              )}
            </div>
          )}

          {order.items?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-black mb-4">Items in this Order</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image || item.product?.images?.[0]?.url || 'https://placehold.co/48x48/0E1526/7DD3FC?text=OM'}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-black">{formatPrice((item.unitPrice || item.price || 0) * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Need help?{' '}
            <a href="/contact" className="text-black hover:underline">Contact our support team</a>
          </p>
        </div>
      )}

      {!order && !error && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
          <strong>Demo Note:</strong> Requires a live backend. Enter an order number from your test orders.
        </div>
      )}
    </div>
  )
}


