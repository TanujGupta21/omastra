import { cn } from '../../lib/utils';

const variants = {
  default:  'bg-gray-100 text-gray-600 border border-gray-200',
  accent:   'bg-black text-white',
  success:  'bg-gray-100 text-gray-700 border border-gray-200',
  warning:  'bg-gray-100 text-gray-700 border border-gray-200',
  danger:   'bg-gray-100 text-gray-700 border border-gray-200',
  info:     'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function Badge({ variant = 'default', className = '', children, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}


