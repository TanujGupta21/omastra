import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, MapPin, Check } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

const BLANK = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }

export default function AddressesPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState(null) // null=closed, {} = new, {_id...} = edit
  const [errors, setErrors] = useState({})

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/users/addresses')
      return data.data || []
    },
  })

  const validate = () => {
    const e = {}
    if (!form.fullName?.trim()) e.fullName = 'Required'
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile required'
    if (!form.line1?.trim()) e.line1 = 'Required'
    if (!form.city?.trim()) e.city = 'Required'
    if (!form.state) e.state = 'Required'
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (form._id) {
        return api.put(`/api/v1/users/addresses/${form._id}`, form)
      }
      return api.post('/api/v1/users/addresses', form)
    },
    onSuccess: () => {
      toast.success(form._id ? 'Address updated' : 'Address added')
      qc.invalidateQueries(['addresses'])
      setForm(null)
      setErrors({})
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not save address'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/v1/users/addresses/${id}`),
    onSuccess: () => {
      toast.success('Address removed')
      qc.invalidateQueries(['addresses'])
    },
  })

  const handleSave = () => {
    if (validate()) saveMutation.mutate()
  }

  const F = ({ k, label, type = 'text', colSpan = 1 }) => (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-black mb-1">{label}</label>
      <input
        type={type}
        value={form[k] || ''}
        onChange={e => setForm({ ...form, [k]: e.target.value })}
        className={`input-field text-sm py-2 ${errors[k] ? 'border-red-400' : ''}`}
      />
      {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wide text-black">Saved Addresses</h1>
        <button
          onClick={() => setForm(BLANK)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-black-hover transition-colors shadow-md shadow-black/10"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Address form */}
      {form && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-black mb-4">{form._id ? 'Edit Address' : 'New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F k="fullName" label="Full Name" colSpan={2} />
            <F k="phone" label="Mobile" type="tel" colSpan={2} />
            <F k="line1" label="Address Line 1" colSpan={2} />
            <F k="line2" label="Line 2 (optional)" colSpan={2} />
            <F k="city" label="City" />
            <F k="pincode" label="Pincode" type="number" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-black mb-1">State</label>
              <select
                value={form.state || ''}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className={`input-field text-sm py-2 ${errors.state ? 'border-red-400' : ''}`}
              >
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
            </div>
            <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault || false} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="accent-[#2864FF]" />
              <span className="text-sm text-gray-500">Set as default address</span>
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saveMutation.isPending} className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-black-hover transition-colors disabled:opacity-60 shadow-md shadow-black/10">
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setForm(null); setErrors({}) }} className="px-5 py-2 border border-gray-200 text-sm text-gray-500 rounded-lg hover:border-black transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Addresses list */}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : addresses.length === 0 && !form ? (
        <div className="card p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No saved addresses. Add one to speed up checkout.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr._id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-black">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="badge badge-accent text-[10px]">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}<br />
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setForm({ ...addr }); setErrors({}) }} className="p-2 text-gray-500 hover:text-black transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (window.confirm('Remove this address?')) deleteMutation.mutate(addr._id) }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



