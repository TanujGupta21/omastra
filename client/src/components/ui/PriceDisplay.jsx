import { formatPrice, discountPercent } from '../../lib/utils';

export default function PriceDisplay({ price, originalPrice, size = 'md', className = '' }) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? discountPercent(originalPrice, price) : 0;

  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-2xl' };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`font-bold text-black ${sizes[size]}`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={`text-gray-400 line-through ${size === 'xl' ? 'text-base' : 'text-xs'}`}>
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-bold text-white bg-black px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}


