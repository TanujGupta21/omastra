import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {(Array.isArray(products) ? products : []).map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}


