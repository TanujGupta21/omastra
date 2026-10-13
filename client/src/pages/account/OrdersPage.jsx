import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import api from '../../lib/api'
import { formatDate, formatPrice } from '../../lib/utils'
import { Skeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_COLORS = {
  pending: 'badge-warning', confirmed: 'badge-success', processing: 'badge-accent',
  shipped: 'badge-accent', delivered: 'badge-success', cancelled: 'badge-danger',
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/orders/my', { params: { limit: 50 } })
      return data.data || []
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-black mb-8">Order History</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here once you make a purchase."
          action={{ label: 'Start Shopping', href: '/shop' }}
        />
      ) : (
        <div className="space-y-3">
          {data.map(order => (
            <Link
              key={order._id}
              to={`/account/orders/${order._id}`}
              className="card flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:border-black transition-colors group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-black group-hover:text-black transition-colors">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {order.items.slice(0, 2).map((item, i) => (
                      <span key={i} className="text-xs text-gray-500">{item.productName}</span>
                    ))}
                    {order.items.length > 2 && (
                      <span className="text-xs text-gray-500">+{order.items.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-black">{formatPrice(order.total)}</p>
                  <span className={`badge ${STATUS_COLORS[order.fulfillmentStatus] || 'badge-warning'} mt-1`}>
                    {order.fulfillmentStatus}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}



