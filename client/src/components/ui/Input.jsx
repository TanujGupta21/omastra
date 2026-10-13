import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input(
  { label, error, helper, className = '', id, required, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-200 hover:border-gray-400',
          error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  );
});

export default Input;


