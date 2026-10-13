import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, ArrowRight, AlertTriangle } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

const STATUS_BADGE = {
  pending: 'badge-warning',
  confirmed: 'badge-accent',
  processing: 'badge-accent',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
  refunded: 'badge-danger',
}

const PAYMENT_BADGE = {
  pending: 'badge-warning',
  paid: 'badge-success',
  failed: 'badge-danger',
  refunded: 'badge-danger',
  cod: 'badge-warning',
}

const ORDER_STATUSES = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['', 'pending', 'paid', 'failed', 'cod']

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'orders', page, search, status, paymentStatus],
    queryFn: async () => {
      const { data } = await adminService.getOrders({
        page,
        limit: 20,
        search: search || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
      })
      // paginated() returns { data: [...], pagination: {total, pages} }
      return { orders: data.data || [], pagination: data.pagination || {} }
    },
    keepPreviousData: true,
  })

  const orders = data?.orders || []
  const totalPages = data?.pagination?.pages || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.pagination?.total ?? orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="admin-order-search"
            type="text"
            placeholder="Search by order # or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="input-field text-sm w-auto"
          id="admin-order-status-filter"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1) }}
          className="input-field text-sm w-auto"
          id="admin-order-payment-filter"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Payments'}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">No orders match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-black font-semibold">
                        #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black font-medium">{order.user?.name || order.guestInfo?.name || 'Guest'}</p>
                      <p className="text-gray-500 text-xs">{order.user?.email || order.guestInfo?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.items?.length || 0}</td>
                    <td className="px-6 py-4 font-semibold text-black">{formatINR(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${PAYMENT_BADGE[order.paymentStatus] || 'badge'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${STATUS_BADGE[order.fulfillmentStatus || order.status] || 'badge'}`}>
                        {order.fulfillmentStatus || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors inline-flex"
                        title="View Order"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-black text-white font-bold shadow-md shadow-black/15'
                  : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


