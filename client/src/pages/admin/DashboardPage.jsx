import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  TrendingUp, ShoppingBag, Users, DollarSign,
  AlertTriangle, ArrowRight, Package
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

const STATUS_COLORS = {
  pending: 'badge-warning',
  confirmed: 'badge-accent',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

function StatCard({ icon: Icon, label, value, sub, color = 'accent' }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}/10`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm shadow-xl">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-black font-semibold">
            {p.name === 'revenue' ? formatINR(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [range, setRange] = useState('30')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard', range],
    queryFn: async () => {
      const from = new Date()
      from.setDate(from.getDate() - Number(range))
      const { data } = await adminService.getDashboardStats({
        from: from.toISOString(),
        to: new Date().toISOString(),
      })
      return data.data
    },
    staleTime: 2 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-gray-500">Failed to load dashboard stats. Check your connection and try again.</p>
      </div>
    )
  }

  const {
    revenue = 0,
    orderCount = 0,
    customerCount = 0,
    avgOrderValue = 0,
    revenueChart = [],
    bestSellers = [],
    recentOrders = [],
    lowStock = [],
  } = data || {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store's performance</p>
        </div>
        <div className="flex items-center gap-2">
          {['7', '30', '90'].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                range === d
                  ? 'bg-black text-white shadow-md shadow-black/15'
                  : 'border border-gray-200 text-gray-500 hover:text-black'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Revenue" value={formatINR(revenue)} sub={`Last ${range} days`} />
        <StatCard icon={ShoppingBag} label="Orders" value={orderCount.toLocaleString('en-IN')} sub={`Last ${range} days`} color="blue-400" />
        <StatCard icon={Users} label="New Customers" value={customerCount.toLocaleString('en-IN')} sub={`Last ${range} days`} color="purple-400" />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={formatINR(avgOrderValue)} sub="Per paid order" color="green-400" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-black mb-4">Revenue Trend</h2>
          {revenueChart.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              No data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E68FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E68FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="_id" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#2E68FF" strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Chart */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-black mb-4">Order Trend</h2>
          {revenueChart.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              No data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="_id" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#7DD3FC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Best Sellers */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-black mb-4">Best Sellers</h2>
          {bestSellers.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          ) : (
            <ul className="space-y-3">
              {bestSellers.map((p, i) => (
                <li key={p._id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.productName}</p>
                    <p className="text-xs text-gray-500">{p.sold} sold · {formatINR(p.revenue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-black">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-black hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-gray-500 font-medium">Order</th>
                    <th className="pb-2 text-left text-gray-500 font-medium">Customer</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">Total</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.slice(0, 7).map((order) => (
                    <tr key={order._id} className="hover:bg-white/50 transition-colors">
                      <td className="py-2.5">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-mono text-xs text-black hover:underline"
                        >
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-2.5 text-gray-500">
                        {order.user?.name || order.guestInfo?.name || 'Guest'}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-black">
                        {formatINR(order.total)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`badge ${STATUS_COLORS[order.fulfillmentStatus || order.status] || 'badge'}`}>
                          {order.fulfillmentStatus || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-black">Low Stock Alerts</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map((item) => (
              <div key={`${item._id}-${item.variantSku}`} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <Package className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.variantFlavor} · {item.variantSize} · <span className="text-amber-400 font-semibold">{item.stock} left</span>
                  </p>
                </div>
                <Link to={`/admin/inventory`} className="ml-auto">
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


