import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, AlertTriangle, Package } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_BADGE = {
  pending: 'badge-warning',
  confirmed: 'badge-accent',
  processing: 'badge-accent',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
  refunded: 'badge-danger',
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200/50 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-black text-sm font-medium text-right">{value || '—'}</span>
    </div>
  )
}

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState('')

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: async () => {
      const { data } = await adminService.getOrder(id)
      return data.data || data
    },
  })

  useEffect(() => {
    if (order) {
      setNewStatus(order.fulfillmentStatus || order.status || '')
    }
  }, [order])

  const statusMutation = useMutation({
    mutationFn: (fulfillmentStatus) => adminService.updateOrderStatus(id, { fulfillmentStatus }),
    onSuccess: () => {
      toast.success('Order status updated')
      queryClient.invalidateQueries(['admin', 'order', id])
      queryClient.invalidateQueries(['admin', 'orders'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" /></div>
  )

  if (isError) return (
    <div className="flex flex-col items-center min-h-[50vh] justify-center gap-3">
      <AlertTriangle className="w-10 h-10 text-red-400" />
      <p className="text-gray-500">Failed to load order</p>
    </div>
  )

  if (!order) return null

  const addr = order.shippingAddress || {}
  const currentStatus = order.fulfillmentStatus || order.status
  const payMethod = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 rounded-lg border border-gray-200 hover:border-black/50 text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black">
            Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${STATUS_BADGE[currentStatus] || 'badge'}`}>
          {currentStatus}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main: Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-black">Order Items</h2>
            </div>
            <div className="divide-y divide-border/50">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[item.flavor, item.size].filter(Boolean).join(' · ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku || '—'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-black font-semibold">{formatINR(item.lineTotal)}</p>
                    <p className="text-xs text-gray-500">
                      {formatINR(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white space-y-2">
              {[
                { label: 'Subtotal', value: formatINR(order.subtotal) },
                order.discount > 0 && { label: `Discount (${order.couponCode || ''})`, value: `−${formatINR(order.discount)}` },
                { label: 'Shipping', value: order.shippingCharge === 0 ? 'Free' : formatINR(order.shippingCharge) },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-black">{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span className="text-black">Total</span>
                <span className="text-black">{formatINR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-black">Update Fulfilment Status</h2>
            <div className="flex items-center gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field flex-1"
                id="admin-order-new-status"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <button
                onClick={() => statusMutation.mutate(newStatus)}
                disabled={statusMutation.isPending || newStatus === currentStatus}
                className="btn-primary min-w-[120px]"
              >
                {statusMutation.isPending ? <Spinner size="sm" /> : 'Update'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Current status: <span className={`badge ml-1 ${STATUS_BADGE[currentStatus] || ''}`}>{currentStatus}</span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card p-5 space-y-1">
            <h3 className="font-semibold text-black mb-3 text-sm">Customer</h3>
            <InfoRow label="Name" value={order.user?.name || order.guestEmail} />
            <InfoRow label="Email" value={order.user?.email || order.guestEmail} />
            <InfoRow label="Phone" value={order.guestPhone || order.user?.phone} />
            <InfoRow label="Type" value={order.user ? 'Registered' : 'Guest'} />
          </div>

          {/* Shipping Address */}
          <div className="card p-5 space-y-1">
            <h3 className="font-semibold text-black mb-3 text-sm">Shipping Address</h3>
            <InfoRow label="Name" value={addr.fullName} />
            <div className="py-2">
              <span className="text-gray-500 text-sm">Address</span>
              <p className="text-black text-sm mt-0.5">
                {[addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
              </p>
            </div>
            <InfoRow label="Phone" value={addr.phone} />
          </div>

          {/* Payment */}
          <div className="card p-5 space-y-1">
            <h3 className="font-semibold text-black mb-3 text-sm">Payment</h3>
            <InfoRow label="Method" value={payMethod} />
            <InfoRow label="Status" value={order.paymentStatus} />
            {order.razorpayOrderId && (
              <InfoRow label="Razorpay Order" value={order.razorpayOrderId} />
            )}
            {order.razorpayPaymentId && (
              <InfoRow label="Razorpay Payment" value={order.razorpayPaymentId} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


