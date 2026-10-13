import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Banknote } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice, formatDate } from '../../lib/utils'
import { Skeleton } from '../../components/ui/Skeleton'

const STATUS_COLORS = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  processing: 'badge-accent',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

export default function OrderSuccessPage() {
  const { id } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      // 1. Try server (authenticated or public)
      try {
        const { data } = await api.get(`/api/v1/orders/my/${id}`)
        if (data?.data) return data.data
      } catch {}
      try {
        const { data } = await api.get(`/api/v1/orders/${id}`)
        if (data?.data) return data.data
      } catch {}

      // 2. Check local fallback storage
      try {
        const lastOrder = JSON.parse(sessionStorage.getItem('omastra_last_order') || 'null')
        if (lastOrder && (lastOrder._id === id || lastOrder.id === id || lastOrder.orderNumber === id)) {
          return lastOrder
        }
        const saved = JSON.parse(localStorage.getItem('omastra_orders') || '[]')
        const found = saved.find(o => o._id === id || o.id === id || o.orderNumber === id)
        if (found) return found
        if (saved.length > 0) return saved[0]
      } catch {}

      return null
    },
    enabled: !!id,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Order details could not be loaded.</p>
        <Link to="/account/orders" className="text-black hover:underline">View your orders</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/15 animate-scale-in">
          <CheckCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-display uppercase tracking-wide text-black mb-1">Order Placed!</h1>
        <p className="text-gray-500 text-sm">
          Thank you for your order. We'll send updates to{' '}
          <span className="text-black">{order.guestEmail || order.user?.email}</span>.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg">
          <span className="text-gray-500 text-sm">Order</span>
          <span className="text-black font-bold">{order.orderNumber}</span>
          <span className={`badge ${STATUS_COLORS[order.fulfillmentStatus] || 'badge-warning'}`}>
            {order.fulfillmentStatus}
          </span>
        </div>
      </div>

      {/* COD Notice Banner */}
      {order.paymentMethod === 'cod' && (
        <div className="mb-6 p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-start gap-3.5 animate-slide-up-sm">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-black text-sm">
              Cash on Delivery: <span className="font-bold text-base">{formatPrice(order.total)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Please keep the exact amount ready in cash or pay via UPI scanner when your delivery partner arrives at your address.
            </p>
          </div>
        </div>
      )}

      {/* Order details card */}
      <div className="card p-6 space-y-6">
        {/* Items */}
        <div>
          <h3 className="font-semibold text-black flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-black" /> Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-white" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    {[item.variantFlavor, item.variantSize].filter(Boolean).join(' · ')} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-black">
              <span>Discount ({order.couponCode})</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
            <span>Total</span><span className="text-black">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Payment & address */}
        <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Payment
            </h4>
            <p className="text-sm text-black capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p className={`text-xs mt-1 ${order.paymentStatus === 'paid' ? 'text-black' : 'text-amber-400'}`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </p>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Delivering to
            </h4>
            <p className="text-sm text-black">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center border-t border-gray-200 pt-4">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/shop" className="flex-1 py-3 text-center bg-black text-white font-bold rounded-xl hover:bg-black-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/15">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/account/orders" className="flex-1 py-3 text-center border border-gray-200 text-gray-500 font-medium rounded-xl hover:border-black hover:text-black transition-colors">
          View All Orders
        </Link>
      </div>
    </div>
  )
}



