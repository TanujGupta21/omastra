import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, className = '' }) {
  return (
    <div className={cn('inline-flex items-center border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-colors duration-200', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all duration-200"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center text-sm font-bold text-black select-none border-x border-gray-100">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}


