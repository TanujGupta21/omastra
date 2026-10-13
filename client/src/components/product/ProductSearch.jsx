import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';

export default function ProductSearch({ value, onChange, placeholder = 'Search products...' }) {
  const [local, setLocal] = useState(value || '');
  const debounced = useDebounce(local, 400);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
  }, [debounced]);

  useEffect(() => {
    if (value !== local) setLocal(value || '');
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/8 transition-all duration-200 hover:border-gray-400"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}


