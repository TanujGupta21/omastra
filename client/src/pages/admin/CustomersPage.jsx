import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, AlertTriangle, UserCheck, UserX } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

export default function CustomersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [confirmTarget, setConfirmTarget] = useState(null) // { customer, action }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'customers', page, search],
    queryFn: async () => {
      const { data } = await adminService.getCustomers({ page, limit: 20, search: search || undefined })
      return data.data || data
    },
    keepPreviousData: true,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminService.updateCustomerStatus(id, isActive),
    onSuccess: () => {
      toast.success('Customer status updated')
      setConfirmTarget(null)
      queryClient.invalidateQueries(['admin', 'customers'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  })

  const customers = data?.customers || (Array.isArray(data) ? data : [])
  const totalPages = data?.pages || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.total ?? customers.length} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          id="admin-customer-search"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input-field pl-9"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load customers</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-black">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-gray-500">{c.phone || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setConfirmTarget({ customer: c, action: !c.isActive })}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          c.isActive
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-black hover:bg-green-500/10'
                        }`}
                        title={c.isActive ? 'Suspend' : 'Activate'}
                      >
                        {c.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        {c.isActive ? 'Suspend' : 'Activate'}
                      </button>
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
                page === p ? 'bg-black text-white font-bold shadow-md shadow-black/15' : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        title={confirmTarget?.action ? 'Activate Customer' : 'Suspend Customer'}
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            {confirmTarget?.action ? 'Activate' : 'Suspend'}{' '}
            <strong className="text-black">{confirmTarget?.customer?.name}</strong>?
            {!confirmTarget?.action && ' They will be unable to log in.'}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setConfirmTarget(null)} className="btn-secondary" disabled={statusMutation.isPending}>
              Cancel
            </button>
            <button
              onClick={() => statusMutation.mutate({ id: confirmTarget.customer._id, isActive: confirmTarget.action })}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                confirmTarget?.action
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? <Spinner size="sm" /> : null}
              {confirmTarget?.action ? 'Activate' : 'Suspend'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



