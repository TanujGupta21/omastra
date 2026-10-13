import { cn } from '../../lib/utils';

export function Skeleton({ className = '' }) {
  return (
    <div className={cn('animate-pulse bg-gray-100 rounded-xl', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
      <Skeleton className="w-full aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}


