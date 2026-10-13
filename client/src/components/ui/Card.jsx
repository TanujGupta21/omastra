import { cn } from '../../lib/utils';

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-xl overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return (
    <div className={cn('p-5 border-b border-gray-200', className)}>{children}</div>
  );
}

export function CardBody({ className = '', children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return (
    <div className={cn('p-5 border-t border-gray-200', className)}>{children}</div>
  );
}


