import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCategories } from '../../hooks/useProducts';

const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹1,000', value: '0-1000' },
  { label: '₹1,000 – ₹2,000', value: '1000-2000' },
  { label: '₹2,000 – ₹4,000', value: '2000-4000' },
  { label: 'Above ₹4,000', value: '4000-999999' },
];

const DIETARY = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Sugar-Free', value: 'sugar-free' },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-black mb-3"
      >
        {title}
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && children}
    </div>
  );
}

export default function ProductFilters(props) {
  const {
    categories: propCategories,
    filters: propFilters,
    onFilterChange,
    className = '',
    category: propCategory,
    minPrice: propMinPrice,
    maxPrice: propMaxPrice,
    dietary: propDietary,
    minRating: propMinRating,
    onCategoryChange,
    onPriceChange,
    onDietaryChange,
    onRatingChange,
  } = props;

  const { data: fetchedCategories = [] } = useCategories();
  const rawCategories = propCategories && propCategories.length > 0 ? propCategories : fetchedCategories;
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const filters = propFilters || {
    category: propCategory || '',
    minPrice: propMinPrice !== undefined && propMinPrice !== null ? String(propMinPrice) : '',
    maxPrice: propMaxPrice !== undefined && propMaxPrice !== null ? String(propMaxPrice) : '',
    dietary: Array.isArray(propDietary)
      ? propDietary
      : typeof propDietary === 'string' && propDietary
      ? propDietary.split(',')
      : [],
    minRating: propMinRating !== undefined && propMinRating !== null ? String(propMinRating) : '',
  };

  const handleCategory = (catId) => {
    const nextCat = filters.category === catId ? '' : catId;
    if (onCategoryChange) {
      onCategoryChange(nextCat);
    }
    if (onFilterChange) {
      onFilterChange({ category: nextCat, page: 1 });
    }
  };

  const isPriceRangeActive = (rangeValue) => {
    if (!rangeValue) {
      return !filters.minPrice && !filters.maxPrice;
    }
    const [min, max] = rangeValue.split('-');
    const currentMin = filters.minPrice || '';
    const currentMax = filters.maxPrice || '';

    if (rangeValue === '4000-999999') {
      return currentMin === '4000' && (!currentMax || currentMax === '999999');
    }
    if (rangeValue === '0-1000') {
      return (!currentMin || currentMin === '0') && currentMax === '1000';
    }
    return currentMin === min && currentMax === max;
  };

  const handlePrice = (rangeValue) => {
    // If clicking the active range, toggle off to All Prices
    const isCurrentlySelected = isPriceRangeActive(rangeValue);
    const target = isCurrentlySelected ? '' : rangeValue;

    let min = '';
    let max = '';
    if (target) {
      const parts = target.split('-');
      min = parts[0] || '';
      max = parts[1] || '';
    }

    if (onPriceChange) {
      onPriceChange(min, max);
    }
    if (onFilterChange) {
      onFilterChange({ minPrice: min, maxPrice: max, page: 1 });
    }
  };

  const handleDietary = (val) => {
    const current = Array.isArray(filters.dietary)
      ? filters.dietary
      : typeof filters.dietary === 'string' && filters.dietary
      ? filters.dietary.split(',')
      : [];
    const updated = current.includes(val)
      ? current.filter((d) => d !== val)
      : [...current, val];

    if (onDietaryChange) {
      onDietaryChange(updated);
    }
    if (onFilterChange) {
      onFilterChange({ dietary: updated.join(','), page: 1 });
    }
  };

  const handleRating = (r) => {
    const ratingStr = r ? String(r) : '';
    const currentRatingStr = filters.minRating ? String(filters.minRating) : '';
    const next = currentRatingStr === ratingStr ? '' : ratingStr;

    if (onRatingChange) {
      onRatingChange(next);
    }
    if (onFilterChange) {
      onFilterChange({ minRating: next, page: 1 });
    }
  };

  return (
    <aside className={cn('w-full', className)}>
      <h2 className="text-base font-bold text-black mb-2">Filters</h2>

      <FilterSection title="Category">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleCategory('')}
              className="accent-black"
            />
            <span className="text-sm text-gray-500">All Categories</span>
          </label>
          {categories.map((cat) => {
            const catId = cat.slug || cat._id || cat.id;
            const isChecked = filters.category === cat.slug || filters.category === (cat._id || cat.id);
            return (
              <label key={cat._id || cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => handleCategory(catId)}
                  className="accent-black"
                />
                <span className="text-sm text-gray-500">{cat.name}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.value || 'all'} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={isPriceRangeActive(range.value)}
                onChange={() => handlePrice(range.value)}
                className="accent-black"
              />
              <span className="text-sm text-gray-500">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dietary">
        <div className="space-y-1.5">
          {DIETARY.map((d) => {
            const currentDietary = Array.isArray(filters.dietary)
              ? filters.dietary
              : typeof filters.dietary === 'string' && filters.dietary
              ? filters.dietary.split(',')
              : [];
            return (
              <label key={d.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentDietary.includes(d.value)}
                  onChange={() => handleDietary(d.value)}
                  className="accent-black"
                />
                <span className="text-sm text-gray-500">{d.label}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Rating" defaultOpen={true}>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => handleRating('')}
              className="accent-black"
            />
            <span className="text-sm text-gray-500">All Ratings</span>
          </label>
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={String(filters.minRating) === String(r)}
                onChange={() => handleRating(r)}
                className="accent-black"
              />
              <span className="text-sm text-gray-500">{r}★ & above</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}


