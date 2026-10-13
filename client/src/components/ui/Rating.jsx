import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Rating({ value = 0, max = 5, size = 'sm', showValue = false, className = '' }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.round(value)
              ? 'fill-black text-black'
              : 'fill-transparent text-gray-200'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs text-gray-500">({value.toFixed(1)})</span>
      )}
    </div>
  );
}


