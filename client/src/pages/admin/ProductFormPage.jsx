import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Spinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const DIETARY = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'soy-free']
const STATUSES = ['active', 'draft', 'archived']

const EMPTY_VARIANT = {
  sku: '', flavor: '', size: '', servings: '', price: '', originalPrice: '', stock: '',
  lowStockThreshold: 10,
}

const EMPTY_FORM = {
  name: '', shortDescription: '', description: '', status: 'active',
  isFeatured: false, isBestSeller: false,
  category: '',
  tags: '',
  dietaryInfo: [],
  ingredients: '', allergens: '', directions: '', storage: '',
  nutritionFacts: {
    servingSize: '', servingsPerPack: '', calories: '', protein: '',
    carbohydrates: '', sugars: '', fat: '', saturatedFat: '', sodium: '',
  },
  variants: [{ ...EMPTY_VARIANT }],
}

function VariantRow({ variant, idx, onChange, onRemove, canRemove }) {
  const handle = (field, value) => onChange(idx, field, value)
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-black">Variant {idx + 1}</p>
        {canRemove && (
          <button type="button" onClick={() => onRemove(idx)}
            className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { key: 'sku', label: 'SKU', placeholder: 'WP-CHOC-1KG' },
          { key: 'flavor', label: 'Flavour', placeholder: 'Chocolate Fudge' },
          { key: 'size', label: 'Pack Size', placeholder: '1 kg' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input value={variant[key]} onChange={(e) => handle(key, e.target.value)}
              placeholder={placeholder} className="input-field text-sm" />
          </div>
        ))}
        {[
          { key: 'price', label: 'Price (₹)', type: 'number' },
          { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
          { key: 'stock', label: 'Stock', type: 'number' },
          { key: 'servings', label: 'Servings', type: 'number' },
          { key: 'lowStockThreshold', label: 'Low Stock Alert', type: 'number' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input type={type} value={variant[key]}
              onChange={(e) => handle(key, e.target.value)}
              className="input-field text-sm" min="0" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Fetch categories
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await adminService.getCategories()
      return data.data || []
    },
  })
  const categories = catData || []

  // Fetch existing product if editing
  const { data: existingProduct, isLoading: productLoading } = useQuery({
    queryKey: ['admin', 'product', id],
    enabled: isEdit,
    queryFn: async () => {
      const { data } = await adminService.getProduct(id)
      return data.data || data
    },
  })

  useEffect(() => {
    if (!existingProduct) return
    setForm({
      name: existingProduct.name || '',
      shortDescription: existingProduct.shortDescription || '',
      description: existingProduct.description || '',
      status: existingProduct.status || 'active',
      isFeatured: existingProduct.isFeatured || false,
      isBestSeller: existingProduct.isBestSeller || false,
      category: existingProduct.category?._id || existingProduct.category || '',
      tags: (existingProduct.tags || []).join(', '),
      dietaryInfo: existingProduct.dietaryInfo || [],
      ingredients: existingProduct.ingredients || '',
      allergens: existingProduct.allergens || '',
      directions: existingProduct.directions || '',
      storage: existingProduct.storage || '',
      nutritionFacts: {
        servingSize: existingProduct.nutritionFacts?.servingSize || '',
        servingsPerPack: existingProduct.nutritionFacts?.servingsPerPack || '',
        calories: existingProduct.nutritionFacts?.calories || '',
        protein: existingProduct.nutritionFacts?.protein || '',
        carbohydrates: existingProduct.nutritionFacts?.carbohydrates || '',
        sugars: existingProduct.nutritionFacts?.sugars || '',
        fat: existingProduct.nutritionFacts?.fat || '',
        saturatedFat: existingProduct.nutritionFacts?.saturatedFat || '',
        sodium: existingProduct.nutritionFacts?.sodium || '',
      },
      variants: existingProduct.variants?.length
        ? existingProduct.variants.map((v) => ({
            sku: v.sku || '',
            flavor: v.flavor || '',
            size: v.size || '',
            servings: v.servings || '',
            price: v.price || '',
            originalPrice: v.originalPrice || '',
            stock: v.stock || '',
            lowStockThreshold: v.lowStockThreshold || 10,
          }))
        : [{ ...EMPTY_VARIANT }],
    })
  }, [existingProduct])

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? adminService.updateProduct(id, payload) : adminService.createProduct(payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated' : 'Product created')
      queryClient.invalidateQueries(['admin', 'products'])
      queryClient.invalidateQueries(['products'])
      navigate('/admin/products')
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to save product'
      toast.error(msg)
    },
  })

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const setNutrition = (key, value) =>
    setForm((f) => ({ ...f, nutritionFacts: { ...f.nutritionFacts, [key]: value } }))

  const updateVariant = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    }))

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { ...EMPTY_VARIANT }] }))

  const removeVariant = (idx) =>
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))

  const toggleDietary = (item) => {
    setForm((f) => ({
      ...f,
      dietaryInfo: f.dietaryInfo.includes(item)
        ? f.dietaryInfo.filter((d) => d !== item)
        : [...f.dietaryInfo, item],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.variants.length) e.variants = 'At least one variant is required'
    form.variants.forEach((v, i) => {
      if (!v.sku) e[`variant_${i}_sku`] = 'SKU required'
      if (!v.price) e[`variant_${i}_price`] = 'Price required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors before saving')
      return
    }
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      variants: form.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
        stock: Number(v.stock),
        servings: v.servings ? Number(v.servings) : undefined,
        lowStockThreshold: Number(v.lowStockThreshold) || 10,
      })),
      nutritionFacts: Object.fromEntries(
        Object.entries(form.nutritionFacts).map(([k, v]) => [k, v === '' ? undefined : Number(v) || v])
      ),
    }
    mutation.mutate(payload)
  }

  if (isEdit && productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg border border-gray-200 hover:border-black/50 text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-black">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Update product details' : 'Add a new product to your catalogue'}
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <section className="card p-6 space-y-5">
        <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-3">
          Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className="input-field"
              placeholder="OMASTRA Whey Pro — Classic Blend"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Short Description</label>
            <input
              value={form.shortDescription}
              onChange={(e) => setField('shortDescription', e.target.value)}
              className="input-field"
              placeholder="One-line product summary shown on cards"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className="input-field min-h-[120px] resize-y"
              placeholder="Supports basic HTML for formatting (p, strong, em, ul, li)"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className="input-field"
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className="input-field"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setField('tags', e.target.value)}
                className="input-field"
                placeholder="whey, protein, muscle"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[
              { key: 'isFeatured', label: 'Featured Product' },
              { key: 'isBestSeller', label: 'Best Seller' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setField(key, e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm text-black">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="card p-6 space-y-4">
        <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-3">
          Variants
        </h2>
        {errors.variants && (
          <p className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.variants}
          </p>
        )}
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <VariantRow
              key={i}
              variant={v}
              idx={i}
              onChange={updateVariant}
              onRemove={removeVariant}
              canRemove={form.variants.length > 1}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 text-sm text-black hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add Variant
        </button>
      </section>

      {/* Nutrition Facts */}
      <section className="card p-6 space-y-4">
        <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-3">
          Nutrition Facts
        </h2>
        <p className="text-xs text-amber-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          All nutrition values must be verified lab-tested data before publishing
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { key: 'servingSize', label: 'Serving Size', type: 'text', placeholder: '30g' },
            { key: 'servingsPerPack', label: 'Servings/Pack', type: 'number' },
            { key: 'calories', label: 'Calories (kcal)', type: 'number' },
            { key: 'protein', label: 'Protein (g)', type: 'number' },
            { key: 'carbohydrates', label: 'Carbohydrates (g)', type: 'number' },
            { key: 'sugars', label: 'Sugars (g)', type: 'number' },
            { key: 'fat', label: 'Fat (g)', type: 'number' },
            { key: 'saturatedFat', label: 'Saturated Fat (g)', type: 'number' },
            { key: 'sodium', label: 'Sodium (mg)', type: 'number' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type={type}
                value={form.nutritionFacts[key]}
                onChange={(e) => setNutrition(key, e.target.value)}
                placeholder={placeholder}
                className="input-field text-sm"
                min={type === 'number' ? '0' : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Product Details */}
      <section className="card p-6 space-y-4">
        <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-3">
          Product Details
        </h2>
        {[
          { key: 'ingredients', label: 'Ingredients', placeholder: 'Full ingredient list (placeholder until verified)' },
          { key: 'allergens', label: 'Allergens', placeholder: 'Contains milk. Manufactured in a facility that handles nuts.' },
          { key: 'directions', label: 'Directions of Use', placeholder: 'Mix 1 scoop with 250ml water…' },
          { key: 'storage', label: 'Storage Instructions', placeholder: 'Store in a cool, dry place.' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm text-gray-500 mb-1.5">{label}</label>
            <textarea
              value={form[key]}
              onChange={(e) => setField(key, e.target.value)}
              className="input-field min-h-[80px] resize-y text-sm"
              placeholder={placeholder}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Dietary Information</label>
          <div className="flex flex-wrap gap-3">
            {DIETARY.map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.dietaryInfo.includes(item)}
                  onChange={() => toggleDietary(item)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm text-black capitalize">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary min-w-[140px]"
        >
          {mutation.isPending ? <Spinner size="sm" /> : (isEdit ? 'Save Changes' : 'Create Product')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="btn-secondary"
          disabled={mutation.isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}


