import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 shadow-card">
        <AlertCircle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">Oops!</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}


