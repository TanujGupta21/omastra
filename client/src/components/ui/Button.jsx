import { cn } from '../../lib/utils';
import Spinner from './Spinner';

const variants = {
  primary:   'bg-black text-white hover:bg-gray-800 font-semibold',
  secondary: 'bg-white text-black hover:bg-gray-50 border border-gray-200 hover:border-black',
  outline:   'border border-black text-black hover:bg-black hover:text-white',
  ghost:     'text-gray-500 hover:text-black hover:bg-gray-100',
  danger:    'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-base px-7 py-3.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}


