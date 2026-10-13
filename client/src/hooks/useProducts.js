import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/products', { params });
        const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        return { data: items, total: data?.pagination?.total ?? items.length };
      } catch {
        return { data: [], total: 0 };
      }
    },
    staleTime: 1000 * 60 * 5,
    initialData: { data: [], total: 0 },
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/products/slug/${slug}`);
        return data?.data || data?.product || data;
      } catch {
        return null;
      }
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
        const result = data.data || data;
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
    initialData: [],
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/categories');
        const result = data.data || data.categories || data;
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
    initialData: [],
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
        return data.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    initialData: [],
  });
}
