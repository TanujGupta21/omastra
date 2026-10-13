import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, getMockProductBySlug } from '../data/mockData';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/products', { params });
        const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (items.length > 0) return { data: items, total: data?.pagination?.total ?? items.length };
      } catch {
        // Fallback
      }
      return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
    },
    staleTime: 1000 * 60 * 5,
    initialData: { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length },
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/products/slug/${slug}`);
        if (data?.data) return data.data;
      } catch {
        // Fallback
      }
      return getMockProductBySlug(slug);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/products', { params: { featured: true, limit: 8 } });
        const result = data?.data || data;
        if (Array.isArray(result) && result.length > 0) return result;
      } catch {
        // Fallback
      }
      return MOCK_PRODUCTS.slice(0, 4);
    },
    staleTime: 1000 * 60 * 10,
    initialData: MOCK_PRODUCTS.slice(0, 4),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/categories');
        const result = data?.data || data?.categories || data;
        if (Array.isArray(result) && result.length > 0) return result;
      } catch {
        // Fallback
      }
      return MOCK_CATEGORIES;
    },
    staleTime: 1000 * 60 * 30,
    initialData: MOCK_CATEGORIES,
  });
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/reviews?product=${productId}`);
        const result = data.data || data.reviews || data;
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!productId,
    initialData: [],
  });
}

export function useRelatedProducts(slug) {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/products/slug/${slug}/related`);
        const result = data?.data || data;
        if (Array.isArray(result) && result.length > 0) return result;
      } catch {
        // Fallback
      }
      return MOCK_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    initialData: [],
  });
}
