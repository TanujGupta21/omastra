import { useParams, Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import ProductCard from '../../components/product/ProductCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ProductSort from '../../components/product/ProductSort'

export default function CategoryPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'featured'
  const page = Number(params.get('page') || 1)

  const { data: catData } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/categories/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', 'category', slug, sort, page],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/products', {
        params: { category: slug, sort, page, limit: 12, status: 'active' },
      })
      return data
    },
    enabled: !!slug,
    keepPreviousData: true,
  })

  const products = data?.data || []
  const pagination = data?.pagination || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="text-black">{catData?.name || slug}</span>
        </div>
        <h1 className="text-4xl font-display uppercase tracking-wide text-black">{catData?.name || slug}</h1>
        {catData?.description && (
          <p className="text-gray-500 mt-2 max-w-xl text-sm">{catData.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {isLoading ? '...' : `${pagination.total || 0} products`}
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <ProductSort value={sort} onChange={(v) => {
          const next = new URLSearchParams(params)
          next.set('sort', v)
          next.set('page', '1')
          setParams(next)
        }} />
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Check back soon for new additions."
          action={{ label: 'Browse All Products', href: '/shop' }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const next = new URLSearchParams(params)
                    next.set('page', String(p))
                    setParams(next)
                  }}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-black text-white font-bold shadow-md shadow-black/15' : 'border border-gray-200 text-gray-500 hover:border-black'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}


