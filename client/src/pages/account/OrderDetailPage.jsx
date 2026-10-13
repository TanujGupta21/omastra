import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Package, MapPin, CreditCard } from 'lucide-react'
import api from '../../lib/api'
import { formatDate, formatPrice } from '../../lib/utils'
import { Skeleton } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'badge-warning', confirmed: 'badge-success', processing: 'badge-accent',
  shipped: 'badge-accent', delivered: 'badge-success', cancelled: 'badge-danger',
}

const PAYMENT_STATUS = {
  pending: 'text-amber-400', paid: 'text-black', failed: 'text-red-400', refunded: 'text-black',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/orders/my/${id}`)
      return data.data
    },
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => api.patch(`/api/v1/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success('Order cancelled')
      queryClient.invalidateQueries(['order', id])
      queryClient.invalidateQueries(['my-orders'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not cancel order'),
  })

  const canCancel = order && ['pending', 'confirmed'].includes(order.fulfillmentStatus)

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
    </div>
  )

  if (!order) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Order not found.</p>
      <Link to="/account/orders" className="text-black hover:underline mt-2 block">Back to orders</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/account/orders" className="text-gray-500 hover:text-black transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-black">{order.orderNumber}</h1>
          <p className="text-xs text-gray-500 mt-0.5">Placed {formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`badge ${STATUS_COLORS[order.fulfillmentStatus] || 'badge-warning'}`}>
            {order.fulfillmentStatus}
          </span>
          {canCancel && (
            <button
              onClick={() => {
                if (window.confirm('Cancel this order?')) cancelMutation.mutate()
              }}
              disabled={cancelMutation.isPending}
              className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="card p-5">
          <h3 className="font-semibold text-black flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-black" /> Items ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.productName} className="w-14 h-14 rounded-lg object-cover bg-white" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{item.productName}</p>
                  {(item.variantFlavor || item.variantSize) && (
                    <p className="text-xs text-gray-500">{[item.variantFlavor, item.variantSize].filter(Boolean).join(' · ')}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                </div>
                <p className="text-sm font-bold text-black">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-black">
                <span>Discount ({order.couponCode})</span><span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h3 className="font-semibold text-black flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-black" /> Payment
          </h3>
          <p className="text-sm text-black capitalize">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </p>
          <p className={`text-xs mt-1 ${PAYMENT_STATUS[order.paymentStatus] || 'text-gray-500'}`}>
            Status: {order.paymentStatus}
          </p>
        </div>

        {/* Shipping address */}
        <div className="card p-5">
          <h3 className="font-semibold text-black flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-black" /> Delivery Address
          </h3>
          <p className="text-sm font-medium text-black">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {order.shippingAddress?.line1}
            {order.shippingAddress?.line2 ? ', ' + order.shippingAddress.line2 : ''}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
          {order.shippingAddress?.phone && (
            <p className="text-xs text-gray-500 mt-1">📞 {order.shippingAddress.phone}</p>
          )}
        </div>

        {/* Status history */}
        {order.statusHistory?.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-black mb-4">Order Timeline</h3>
            <div className="space-y-3">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-black capitalize">{h.status}</p>
                    {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                    <p className="text-xs text-gray-500">{formatDate(h.changedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



