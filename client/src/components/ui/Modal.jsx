import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Modal({ isOpen, onClose, title, children, className = '', size = 'md' }) {
  const ref = useRef();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        className={cn('relative w-full bg-white border border-gray-200 rounded-2xl shadow-2xl animate-scale-in', sizes[size], className)}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-black">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export { Modal };


