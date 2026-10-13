import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

const STATUS_BADGE = {
  active: 'badge-success',
  draft: 'badge-warning',
  archived: 'badge-danger',
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: async () => {
      const { data } = await adminService.getProducts({
        page,
        limit: 20,
        search: search || undefined,
        status: 'all',
      })
      // paginated() returns { data: [...], pagination: {total, pages} }
      return { products: data.data || [], pagination: data.pagination || {} }
    },
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries(['admin', 'products'])
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    },
  })

  const products = data?.products || []
  const totalPages = data?.pagination?.pages || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wide text-black">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.pagination?.total ?? products.length} products in your catalogue
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="btn-primary gap-2"
          id="admin-add-product"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          id="admin-product-search"
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input-field pl-9"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load products</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-gray-500">No products found</p>
            <button onClick={() => navigate('/admin/products/new')} className="btn-primary">
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price from</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {products.map((product) => {
                  const minPrice = Math.min(...(product.variants || []).map((v) => v.price))
                  const totalStock = (product.variants || []).reduce((s, v) => s + (v.stock || 0), 0)
                  return (
                    <tr key={product._id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-500 text-xs">IMG</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-black">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {product.category?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-black">{product.variants?.length || 0} variants</p>
                        <p className="text-xs text-gray-500">{totalStock} total stock</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">
                        {product.variants?.length ? formatINR(minPrice) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${STATUS_BADGE[product.status] || 'badge'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete <strong className="text-black">{deleteTarget?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn-secondary"
              disabled={deleteMutation.isPending}
            >
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


