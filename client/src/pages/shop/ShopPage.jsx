import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X } from 'lucide-react'
import api from '../../lib/api'
import ProductCard from '../../components/product/ProductCard'
import ProductFilters from '../../components/product/ProductFilters'
import ProductSort from '../../components/product/ProductSort'
import ProductSearch from '../../components/product/ProductSearch'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const page      = Number(params.get('page') || 1)
  const sort      = params.get('sort') || 'featured'
  const category  = params.get('category') || ''
  const search    = params.get('search') || ''
  const minPrice  = params.get('minPrice') || ''
  const maxPrice  = params.get('maxPrice') || ''
  const dietary   = params.get('dietary') || ''
  const minRating = params.get('minRating') || ''

  const updateParams = (updates) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          next.set(key, String(value))
        } else {
          next.delete(key)
        }
      })
      if (!('page' in updates)) {
        next.set('page', '1')
      }
      return next
    })
  }

  const updateParam = (key, value) => {
    updateParams({ [key]: value })
  }

  const clearFilters = () => setParams({ sort, page: '1' })
  const hasFilters = Boolean(category || search || minPrice || maxPrice || dietary || minRating)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', { page, sort, category, search, minPrice, maxPrice, dietary, minRating }],
    queryFn: async () => {
      const queryParams = {
        page,
        limit: 12,
        sort,
        status: 'active',
      }
      if (category) queryParams.category = category
      if (search) queryParams.search = search
      if (minPrice !== '') queryParams.minPrice = minPrice
      if (maxPrice !== '') queryParams.maxPrice = maxPrice
      if (dietary) queryParams.dietary = dietary
      if (minRating !== '') queryParams.minRating = minRating

      const { data } = await api.get('/api/v1/products', { params: queryParams })
      return data
    },
    keepPreviousData: true,
  })

  const products   = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
  const pagination = data?.pagination || {}

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-1">Discover</span>
          <h1 className="font-display text-5xl md:text-6xl text-black font-bold tracking-tight mb-2">All Products</h1>
          <p className="text-gray-400 text-sm">
            {isLoading ? 'Loading...' : `${pagination.total || 0} product${(pagination.total || 0) !== 1 ? 's' : ''}`}
            {hasFilters && <span className="text-black font-semibold ml-1">(filtered)</span>}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <ProductSearch value={search} onChange={(v) => updateParam('search', v)} className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 lg:hidden ${
                filtersOpen || hasFilters ? 'border-black text-black bg-gray-50' : 'border-gray-200 text-gray-500 hover:border-black bg-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-black" />}
            </button>
            <ProductSort value={sort} onChange={(v) => updateParam('sort', v)} />
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
            <span className="text-xs text-gray-400 font-medium">Active:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full font-semibold">
                "{search}"
                <button onClick={() => updateParam('search', '')} className="hover:opacity-70 transition-opacity" title="Remove search"><X className="w-3 h-3" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full font-semibold">
                {category}
                <button onClick={() => updateParam('category', '')} className="hover:opacity-70 transition-opacity" title="Remove category"><X className="w-3 h-3" /></button>
              </span>
            )}
            {(minPrice !== '' || maxPrice !== '') && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full font-semibold">
                {minPrice !== '' && maxPrice !== '' && maxPrice !== '999999'
                  ? `₹${minPrice}–₹${maxPrice}`
                  : maxPrice !== '' && (!minPrice || minPrice === '0')
                  ? `Under ₹${maxPrice}`
                  : minPrice !== ''
                  ? `₹${minPrice}+`
                  : `₹0–₹${maxPrice}`}
                <button onClick={() => updateParams({ minPrice: '', maxPrice: '' })} className="hover:opacity-70" title="Remove price filter"><X className="w-3 h-3" /></button>
              </span>
            )}
            {dietary && dietary.split(',').filter(Boolean).map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full font-semibold capitalize">
                {d.replace('-', ' ')}
                <button
                  onClick={() => {
                    const remaining = dietary.split(',').filter((item) => item !== d).join(',')
                    updateParam('dietary', remaining)
                  }}
                  className="hover:opacity-70 transition-opacity"
                  title={`Remove ${d}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {minRating !== '' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full font-semibold">
                {minRating}★ & above
                <button onClick={() => updateParam('minRating', '')} className="hover:opacity-70 transition-opacity" title="Remove rating filter"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black underline underline-offset-2 font-medium transition-colors">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-56 flex-shrink-0 mb-6 lg:mb-0`}>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between lg:hidden pb-3 mb-3 border-b border-gray-100">
                <span className="font-bold text-sm text-black">Filters</span>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-1 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ProductFilters
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                dietary={dietary}
                minRating={minRating}
                onFilterChange={updateParams}
                onCategoryChange={(cat) => updateParam('category', cat)}
                onPriceChange={(min, max) => updateParams({ minPrice: min, maxPrice: max })}
                onDietaryChange={(diet) => updateParam('dietary', diet.join(','))}
                onRatingChange={(r) => updateParam('minRating', r)}
              />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {isError ? (
              <ErrorState onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description={hasFilters ? 'Try adjusting your filters.' : 'No products available right now.'}
                action={hasFilters ? { label: 'Clear Filters', onClick: clearFilters } : null}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p, i) => (
                    <div key={p._id} className="reveal visible" style={{ transitionDelay: `${Math.min(i * 40, 300)}ms` }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateParam('page', String(page - 1))}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => updateParam('page', String(p))}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                            p === page
                              ? 'bg-black text-white'
                              : 'border border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => updateParam('page', String(page + 1))}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


