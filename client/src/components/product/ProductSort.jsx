import Select from '../ui/Select';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductSort({ value, onChange }) {
  return (
    <Select
      options={SORT_OPTIONS}
      value={value || 'featured'}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[180px]"
    />
  );
}


