import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/products', { params });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/products/slug/${slug}`);
      return data.data || data.product || data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/products', { params: { featured: true, limit: 8 } });
      return data.data || data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/categories');
      return data.data || data.categories || data;
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/reviews?product=${productId}`);
      return data.data || data.reviews || data;
    },
    enabled: !!productId,
  });
}

export function useRelatedProducts(slug) {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/products/slug/${slug}/related`);
      return data.data || [];
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
