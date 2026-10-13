import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, AlertTriangle, AlertCircle } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const TYPES = ['percentage', 'fixed']
const EMPTY = {
  code: '', type: 'percentage', value: '', minOrderAmount: '',
  maxUses: '', expiresAt: '', isActive: true, description: '',
}

function CouponForm({ form, setForm }) {
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Code *</label>
          <input
            value={form.code}
            onChange={(e) => set('code', e.target.value.toUpperCase())}
            className="input-field text-sm"
            placeholder="SAVE20"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input-field text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{t === 'percentage' ? 'Percentage %' : 'Fixed Amount ₹'}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Value {form.type === 'percentage' ? '(%)' : '(₹)'} *
          </label>
          <input
            type="number" min="0" max={form.type === 'percentage' ? 100 : undefined}
            value={form.value}
            onChange={(e) => set('value', e.target.value)}
            className="input-field text-sm"
            placeholder={form.type === 'percentage' ? '20' : '200'}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min Order Amount (₹)</label>
          <input type="number" min="0" value={form.minOrderAmount}
            onChange={(e) => set('minOrderAmount', e.target.value)}
            className="input-field text-sm" placeholder="999" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max Uses (leave blank = unlimited)</label>
          <input type="number" min="1" value={form.maxUses}
            onChange={(e) => set('maxUses', e.target.value)}
            className="input-field text-sm" placeholder="100" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Expires At</label>
          <input type="datetime-local" value={form.expiresAt}
            onChange={(e) => set('expiresAt', e.target.value)}
            className="input-field text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input value={form.description} onChange={(e) => set('description', e.target.value)}
          className="input-field text-sm" placeholder="Save 20% on all orders" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
          className="w-4 h-4 accent-accent" />
        <span className="text-sm text-black">Active</span>
      </label>
    </div>
  )
}

export default function CouponsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data } = await adminService.getCoupons()
      return data.data || []
    },
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editTarget ? adminService.updateCoupon(editTarget._id, payload) : adminService.createCoupon(payload),
    onSuccess: () => {
      toast.success(editTarget ? 'Coupon updated' : 'Coupon created')
      setShowModal(false)
      setEditTarget(null)
      setForm(EMPTY)
      queryClient.invalidateQueries(['admin', 'coupons'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save coupon'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCoupon(id),
    onSuccess: () => {
      toast.success('Coupon deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries(['admin', 'coupons'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  })

  const openAdd = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditTarget(c)
    setForm({
      code: c.code || '',
      type: c.type || 'percentage',
      value: c.value || '',
      minOrderAmount: c.minOrderAmount || '',
      maxUses: c.maxUses || '',
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 16) : '',
      isActive: c.isActive ?? true,
      description: c.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim()) { toast.error('Code is required'); return }
    if (!form.value) { toast.error('Discount value is required'); return }
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
    }
    saveMutation.mutate(payload)
  }

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} coupons</p>
        </div>
        <button onClick={openAdd} className="btn-primary gap-2" id="admin-add-coupon">
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load coupons</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <p className="text-gray-500">No coupons created yet</p>
            <button onClick={openAdd} className="btn-primary">Create first coupon</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-white/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-black">{c.code}</span>
                      {c.description && <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-black">
                      {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {c.minOrderAmount ? `₹${c.minOrderAmount}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {c.usedCount || 0}{c.maxUses ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {c.expiresAt
                        ? <span className={isExpired(c) ? 'text-red-400' : ''}>
                            {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                          </span>
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {isExpired(c) ? (
                        <span className="badge badge-danger">Expired</span>
                      ) : (
                        <span className={`badge ${c.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(c)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditTarget(null) }}
        title={editTarget ? 'Edit Coupon' : 'New Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <CouponForm form={form} setForm={setForm} />
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={saveMutation.isPending}>
              Cancel
            </button>
            <button type="submit" className="btn-primary min-w-[100px]" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Spinner size="sm" /> : (editTarget ? 'Save' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Coupon">
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Delete coupon <strong className="text-black font-mono">{deleteTarget?.code}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary" disabled={deleteMutation.isPending}>Cancel</button>
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


