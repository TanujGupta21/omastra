import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', id, placeholder, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-black">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full appearance-none bg-white border rounded-xl px-4 py-2.5 pr-10 text-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-200 cursor-pointer',
            error ? 'border-red-400' : 'border-gray-200 hover:border-black',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;


