import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import api from '../../lib/api'
import ProductCard from '../../components/product/ProductCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/products', {
        params: { search: q, limit: 24, status: 'active' },
      })
      return data
    },
    enabled: !!q,
  })

  const products = data?.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-black" />
          <h1 className="text-2xl font-bold text-black">
            {q ? `Results for "${q}"` : 'Search Products'}
          </h1>
        </div>
        {q && !isLoading && (
          <p className="text-gray-500 text-sm">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {!q ? (
        <EmptyState
          icon={Search}
          title="Type something to search"
          description="Use the search bar in the header to find products."
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title={`No results for "${q}"`}
          description="Try a different search term or browse by category."
          action={{ label: 'Browse All Products', href: '/shop' }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}


