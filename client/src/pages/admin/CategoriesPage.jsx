import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', description: '', sortOrder: '' }

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data } = await adminService.getCategories()
      return data.data || []
    },
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editTarget
        ? adminService.updateCategory(editTarget._id, payload)
        : adminService.createCategory(payload),
    onSuccess: () => {
      toast.success(editTarget ? 'Category updated' : 'Category created')
      setShowModal(false)
      setEditTarget(null)
      setForm(EMPTY_FORM)
      queryClient.invalidateQueries(['admin', 'categories'])
      queryClient.invalidateQueries(['categories'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries(['admin', 'categories'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  })

  const openAdd = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setForm({ name: cat.name, description: cat.description || '', sortOrder: cat.sortOrder || '' })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    saveMutation.mutate({
      name: form.name.trim(),
      description: form.description.trim(),
      sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{(data || []).length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary gap-2" id="admin-add-category">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-gray-500 text-sm">Failed to load categories</p>
          </div>
        ) : (data || []).length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <p className="text-gray-500">No categories yet</p>
            <button onClick={openAdd} className="btn-primary">Create first category</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(data || []).map((cat) => (
                <tr key={cat._id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-black">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell truncate max-w-[200px]">
                    {cat.description || '—'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.sortOrder ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditTarget(null) }}
        title={editTarget ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="Whey Protein"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field min-h-[80px] resize-y text-sm"
              placeholder="Short description for this category"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Display Order</label>
            <input
              type="number"
              min="0"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              className="input-field"
              placeholder="1"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
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
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Delete <strong className="text-black">{deleteTarget?.name}</strong>?
            Products in this category will need to be reassigned.
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


