import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const STATUS_BADGE = {
  approved: 'badge-success',
  pending: 'badge-warning',
  rejected: 'badge-danger',
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= rating ? 'text-black fill-accent' : 'text-border fill-border'}`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'reviews', page, search, filterStatus],
    queryFn: async () => {
      const { data } = await adminService.getReviews({
        page,
        limit: 20,
        search: search || undefined,
        status: filterStatus || undefined,
      })
      return data.data || data
    },
    keepPreviousData: true,
  })

  const moderateMutation = useMutation({
    mutationFn: ({ id, action }) => adminService.moderateReview(id, action),
    onSuccess: () => {
      toast.success('Review updated')
      queryClient.invalidateQueries(['admin', 'reviews'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update review'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries(['admin', 'reviews'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  })

  const reviews = data?.reviews || (Array.isArray(data) ? data : [])
  const totalPages = data?.pages || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.total ?? reviews.length} reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="admin-review-search"
            type="text"
            placeholder="Search reviews…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          className="input-field text-sm w-auto"
          id="admin-review-status-filter"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load reviews</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="card flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">No reviews match your filters</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-black text-xs font-bold">
                        {review.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-black">
                        {review.user?.name || 'Anonymous'}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <span className={`badge ${STATUS_BADGE[review.status] || 'badge'}`}>
                      {review.status || 'pending'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {review.title && (
                    <p className="text-black font-semibold text-sm mb-1">{review.title}</p>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>
                  {review.product && (
                    <p className="text-xs text-gray-500 mt-2">
                      Product: <span className="text-black">{review.product?.name || review.productName}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => moderateMutation.mutate({ id: review._id, action: 'approve' })}
                      disabled={moderateMutation.isPending}
                      className="p-2 rounded-lg hover:bg-green-500/10 text-gray-500 hover:text-black transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => moderateMutation.mutate({ id: review._id, action: 'reject' })}
                      disabled={moderateMutation.isPending}
                      className="p-2 rounded-lg hover:bg-amber-500/10 text-gray-500 hover:text-amber-400 transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Review">
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Permanently delete this review by{' '}
            <strong className="text-black">{deleteTarget?.user?.name}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary" disabled={deleteMutation.isPending}>
              Cancel
            </button>
            <button
              onClick={() => deleteMutation.mutate(deleteTarget._id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner size="sm" /> : null}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



