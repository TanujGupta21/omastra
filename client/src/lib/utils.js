import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const discountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

export const slugToTitle = (slug) =>
  slug?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const getProductImage = (product) => {
  if (!product) return 'https://placehold.co/400x400/0E1526/7DD3FC?text=OMASTRA';
  const primary = product.images?.find((img) => img.isPrimary);
  return primary?.url || product.images?.[0]?.url || 'https://placehold.co/400x400/0E1526/7DD3FC?text=OMASTRA';
};

export const getLowestPrice = (variants) => {
  if (!variants?.length) return null;
  const active = variants.filter((v) => v.isActive !== false && v.stock > 0);
  if (!active.length) return null;
  return Math.min(...active.map((v) => v.price));
};

export const getOriginalPrice = (variants) => {
  if (!variants?.length) return null;
  const active = variants.filter((v) => v.isActive !== false && v.stock > 0);
  const withOrig = active.find((v) => v.originalPrice && v.originalPrice > v.price);
  return withOrig?.originalPrice || null;
};

export const getStockStatus = (variants) => {
  if (!variants?.length) return 'out-of-stock';
  const total = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  if (total === 0) return 'out-of-stock';
  if (total <= 20) return 'low-stock';
  return 'in-stock';
};

export const SHIPPING_THRESHOLD = 999;
export const SHIPPING_CHARGE = 99;

export const calcShipping = (subtotal) =>
  subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;

export const GUEST_CART_KEY = 'omastra_guest_cart';
export const GUEST_WISHLIST_KEY = 'omastra_guest_wishlist';
