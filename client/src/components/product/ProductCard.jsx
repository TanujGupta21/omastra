import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import PriceDisplay from '../ui/PriceDisplay';
import Rating from '../ui/Rating';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { cn } from '../../lib/utils';

function StockBadge({ stock }) {
  if (stock === 0) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Out of Stock</span>
  );
  if (stock <= 10) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white">Low Stock</span>
  );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">In Stock</span>
  );
}

export default function ProductCard({ product, loading = false }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (loading) return <ProductCardSkeleton />;

  const wishlisted = isWishlisted(product._id);
  const primaryVariant = product.variants?.[0];
  const displayPrice = primaryVariant?.price || product.price;
  const displayOriginalPrice = primaryVariant?.originalPrice || product.originalPrice;
  const stock = primaryVariant?.stock ?? product.stock ?? 99;
  const flavors = product.variants?.map((v) => v.flavor).filter(Boolean);
  const uniqueFlavors = [...new Set(flavors)];
  const sizes = product.variants?.map((v) => v.size).filter(Boolean);
  const uniqueSizes = [...new Set(sizes)];

  const discountPct = displayOriginalPrice && displayPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (stock === 0 || adding) return;
    setAdding(true);
    await addItem(product, primaryVariant);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  const placeholder = `https://placehold.co/400x400/F5F5F5/0A0A0A?text=${encodeURIComponent(product.name || 'OMASTRA')}`;
  const primaryImg = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || product.image;
  const imageUrl = imgError || !primaryImg ? placeholder : primaryImg;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-black hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount pill */}
        {discountPct >= 5 && (
          <span className="absolute top-3 left-3 bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-fade-in">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-sm bg-white border',
            'hover:scale-110 active:scale-95',
            wishlisted
              ? 'text-black border-black scale-110'
              : 'text-gray-300 border-gray-200 hover:text-black hover:border-black'
          )}
        >
          <Heart className={cn('w-4 h-4 transition-all', wishlisted && 'fill-current')} />
        </button>

        {/* Category */}
        {product.category?.name && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs text-gray-500 px-2.5 py-1 rounded-full border border-white/70 font-medium">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-black line-clamp-2 group-hover:text-gray-600 transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
          <StockBadge stock={stock} />
        </div>

        {product.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <Rating value={product.averageRating} size="sm" />
            <span className="text-xs text-gray-400">({product.reviewCount || 0})</span>
          </div>
        )}

        {(uniqueFlavors.length > 0 || uniqueSizes.length > 0) && (
          <p className="text-xs text-gray-400">
            {uniqueFlavors.length > 0 && `${uniqueFlavors.length} flavor${uniqueFlavors.length > 1 ? 's' : ''}`}
            {uniqueFlavors.length > 0 && uniqueSizes.length > 0 && ' · '}
            {uniqueSizes.length > 0 && uniqueSizes.join(', ')}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100">
          <PriceDisplay price={displayPrice} originalPrice={displayOriginalPrice} size="md" />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={cn(
            'mt-1 w-full py-2.5 rounded-xl text-sm font-semibold',
            'flex items-center justify-center gap-2',
            'transition-all duration-300 active:scale-[0.97]',
            stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : added
                ? 'bg-black text-white'
                : 'bg-black text-white hover:bg-gray-800'
          )}
        >
          {stock === 0 ? (
            <><ShoppingCart className="w-4 h-4" />Out of Stock</>
          ) : added ? (
            <><Check className="w-4 h-4" />Added!</>
          ) : adding ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Adding...</>
          ) : (
            <><ShoppingCart className="w-4 h-4" />Add to Cart</>
          )}
        </button>
      </div>
    </Link>
  );
}


