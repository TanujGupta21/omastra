import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, AlertTriangle, Package, Plus, Minus } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const REASONS = [
  'stock-adjustment', 'purchase', 'return', 'damaged', 'expired', 'correction', 'other'
]

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [adjustTarget, setAdjustTarget] = useState(null) // { product, variant }
  const [adjustForm, setAdjustForm] = useState({ delta: '', reason: 'stock-adjustment', note: '' })

  // Fetch products with variant stock info
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'inventory', search],
    queryFn: async () => {
      const { data } = await adminService.getProducts({
        limit: 100,
        search: search || undefined,
        adminView: 'true',
      })
      return data.data?.products || data.data || (Array.isArray(data.data) ? data.data : [])
    },
  })

  const adjustMutation = useMutation({
    mutationFn: (payload) => adminService.adjustInventory(payload),
    onSuccess: () => {
      toast.success('Stock adjusted')
      setAdjustTarget(null)
      setAdjustForm({ delta: '', reason: 'stock-adjustment', note: '' })
      queryClient.invalidateQueries(['admin', 'inventory'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to adjust stock'),
  })

  const products = Array.isArray(data) ? data : []

  const handleAdjust = (e) => {
    e.preventDefault()
    if (!adjustForm.delta) { toast.error('Enter adjustment quantity'); return }
    adjustMutation.mutate({
      productId: adjustTarget.product._id,
      variantSku: adjustTarget.variant.sku,
      adjustment: Number(adjustForm.delta),
      reason: adjustForm.reason,
      note: adjustForm.note,
    })
  }

  // Build flat list of [product, variant] pairs
  const rows = products.flatMap((p) =>
    (p.variants || []).map((v) => ({ product: p, variant: v }))
  )

  const filtered = search
    ? rows.filter(
        ({ product, variant }) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          variant.sku?.toLowerCase().includes(search.toLowerCase()) ||
          variant.flavor?.toLowerCase().includes(search.toLowerCase())
      )
    : rows

  const isLow = (v) => v.stock <= (v.lowStockThreshold || 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} SKUs</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          id="admin-inventory-search"
          type="text"
          placeholder="Search product or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load inventory</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">No results</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  {['Product', 'SKU', 'Flavour', 'Size', 'Stock', 'Status', 'Adjust'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map(({ product, variant }) => (
                  <tr key={`${product._id}-${variant.sku}`} className={`hover:bg-white/40 transition-colors ${isLow(variant) ? 'bg-amber-500/3' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isLow(variant) && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        <span className="font-medium text-black truncate max-w-[160px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{variant.sku || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{variant.flavor || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{variant.size || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`font-bold text-base ${isLow(variant) ? 'text-amber-400' : 'text-black'}`}>
                        {variant.stock}
                      </span>
                      {variant.lowStockThreshold && (
                        <span className="text-xs text-gray-500 ml-1">/ threshold {variant.lowStockThreshold}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isLow(variant) ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : variant.stock === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setAdjustTarget({ product, variant })}
                        className="inline-flex items-center gap-1 text-xs text-black hover:underline font-medium"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        title="Adjust Stock"
      >
        {adjustTarget && (
          <form onSubmit={handleAdjust} className="space-y-4">
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-black font-medium text-sm">{adjustTarget.product.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {[adjustTarget.variant.flavor, adjustTarget.variant.size].filter(Boolean).join(' · ')} · SKU: {adjustTarget.variant.sku}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Current stock: <span className="text-black font-bold">{adjustTarget.variant.stock}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">
                Adjustment (positive to add, negative to remove)
              </label>
              <div className="flex items-center gap-2">
                <button type="button"
                  onClick={() => setAdjustForm((f) => ({ ...f, delta: String(Number(f.delta || 0) - 1) }))}
                  className="p-2 rounded-lg border border-gray-200 hover:border-black text-gray-500 hover:text-black transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={adjustForm.delta}
                  onChange={(e) => setAdjustForm((f) => ({ ...f, delta: e.target.value }))}
                  className="input-field text-center flex-1"
                  placeholder="e.g. 50 or -10"
                />
                <button type="button"
                  onClick={() => setAdjustForm((f) => ({ ...f, delta: String(Number(f.delta || 0) + 1) }))}
                  className="p-2 rounded-lg border border-gray-200 hover:border-black text-gray-500 hover:text-black transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {adjustForm.delta && (
                <p className="text-xs text-gray-500 mt-1">
                  New stock will be:{' '}
                  <span className="text-black font-bold">
                    {Math.max(0, adjustTarget.variant.stock + Number(adjustForm.delta))}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Reason</label>
              <select
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm((f) => ({ ...f, reason: e.target.value }))}
                className="input-field text-sm"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Note (optional)</label>
              <input
                value={adjustForm.note}
                onChange={(e) => setAdjustForm((f) => ({ ...f, note: e.target.value }))}
                className="input-field text-sm"
                placeholder="Received new stock from supplier"
              />
            </div>

            <div className="flex gap-3 justify-end border-t border-gray-200 pt-4">
              <button type="button" onClick={() => setAdjustTarget(null)} className="btn-secondary" disabled={adjustMutation.isPending}>
                Cancel
              </button>
              <button type="submit" className="btn-primary min-w-[120px]" disabled={adjustMutation.isPending}>
                {adjustMutation.isPending ? <Spinner size="sm" /> : 'Apply Adjustment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}


