import ProductGrid from './ProductGrid';
import { useRelatedProducts } from '../../hooks/useProducts';

export default function RelatedProducts({ productSlug, productId }) {
  const slug = productSlug || productId;
  const { data, isLoading } = useRelatedProducts(slug);
  const products = Array.isArray(data) ? data : data?.products || data?.data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-black mb-6">You May Also Like</h2>
      <ProductGrid
        products={products}
        loading={isLoading}
        skeletonCount={4}
      />
    </section>
  );
}


