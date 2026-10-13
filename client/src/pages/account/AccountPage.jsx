import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { Package, MapPin, Heart, User, ChevronRight } from 'lucide-react'
import api from '../../lib/api'
import { formatDate, formatPrice } from '../../lib/utils'

export default function AccountPage() {
  const { user } = useAuth()

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders', 1],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/orders/my', { params: { limit: 3 } })
      return data
    },
  })

  const recentOrders = ordersData?.data || []

  const QUICK_LINKS = [
    { label: 'My Orders', sub: 'Track and manage orders', href: '/account/orders', icon: Package },
    { label: 'Addresses', sub: 'Saved delivery addresses', href: '/account/addresses', icon: MapPin },
    { label: 'Wishlist', sub: 'Products you love', href: '/wishlist', icon: Heart },
    { label: 'Profile', sub: 'Update your details', href: '/account/profile', icon: User },
  ]

  const STATUS_COLORS = {
    pending: 'text-amber-400', confirmed: 'text-black',
    processing: 'text-black', shipped: 'text-black',
    delivered: 'text-black', cancelled: 'text-red-400',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">My Account</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {QUICK_LINKS.map(({ label, sub, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className="group p-5 card hover:border-black transition-colors"
          >
            <Icon className="w-6 h-6 text-black mb-3" />
            <p className="font-semibold text-black text-sm group-hover:text-black transition-colors">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-black">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm text-black hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card p-8 text-center">
            <Package className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No orders yet.</p>
            <Link to="/shop" className="text-black text-sm hover:underline mt-2 block">Start shopping →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="card p-4 flex items-center justify-between hover:border-black transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-black group-hover:text-black transition-colors">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">{formatPrice(order.total)}</p>
                    <p className={`text-xs capitalize ${STATUS_COLORS[order.fulfillmentStatus] || 'text-gray-500'}`}>
                      {order.fulfillmentStatus}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



