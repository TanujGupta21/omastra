import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm shadow-xl">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.name === 'revenue' || p.name === 'avgOrder' ? formatINR(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const RANGES = [
  { label: '7d', days: 7, groupBy: 'day' },
  { label: '30d', days: 30, groupBy: 'day' },
  { label: '90d', days: 90, groupBy: 'week' },
  { label: '1y', days: 365, groupBy: 'month' },
]

export default function AnalyticsPage() {
  const [rangeIdx, setRangeIdx] = useState(1)
  const range = RANGES[rangeIdx]

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'analytics', rangeIdx],
    queryFn: async () => {
      const from = new Date()
      from.setDate(from.getDate() - range.days)
      const { data } = await adminService.getAnalytics({
        from: from.toISOString(),
        to: new Date().toISOString(),
        groupBy: range.groupBy,
      })
      return data.data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const chartData = Array.isArray(data) ? data : []

  // Summary metrics
  const totalRevenue = chartData.reduce((s, d) => s + (d.revenue || 0), 0)
  const totalOrders = chartData.reduce((s, d) => s + (d.orders || 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const peakRevenue = chartData.reduce((m, d) => Math.max(m, d.revenue || 0), 0)

  const summaryCards = [
    { label: 'Total Revenue', value: formatINR(totalRevenue) },
    { label: 'Total Orders', value: totalOrders.toLocaleString('en-IN') },
    { label: 'Avg Order Value', value: formatINR(avgOrderValue) },
    { label: 'Peak Day Revenue', value: formatINR(peakRevenue) },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Revenue and order trends</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setRangeIdx(i)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                rangeIdx === i
                  ? 'bg-black text-white shadow-md shadow-black/15'
                  : 'border border-gray-200 text-gray-500 hover:text-black'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>
      ) : isError ? (
        <div className="flex flex-col items-center min-h-[30vh] justify-center gap-3">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map(({ label, value }) => (
              <div key={label} className="card p-5">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-2xl font-bold text-black">{value}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-black mb-4">Revenue Over Time</h2>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-52 text-gray-500 text-sm">
                No data for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E68FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2E68FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="_id" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#2E68FF" strokeWidth={2.5} fill="url(#gradRevenue)" name="revenue" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders + Avg Order Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-base font-semibold text-black mb-4">Orders Volume</h2>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="_id" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" fill="#7DD3FC" radius={[4, 4, 0, 0]} name="orders" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-base font-semibold text-black mb-4">Avg Order Value</h2>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#223954" />
                    <XAxis dataKey="_id" tick={{ fill: '#A9C1D4', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#A9C1D4', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="avgOrder" stroke="#9BDDF7" strokeWidth={2} dot={false} name="avgOrder" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Data Table */}
          {chartData.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-black">Period Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      {['Period', 'Orders', 'Revenue', 'Avg Order'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {chartData.map((row) => (
                      <tr key={row._id} className="hover:bg-white/40 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{row._id}</td>
                        <td className="px-6 py-3 text-black font-medium">{row.orders}</td>
                        <td className="px-6 py-3 text-black font-semibold">{formatINR(row.revenue)}</td>
                        <td className="px-6 py-3 text-gray-500">{formatINR(row.avgOrder)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}


