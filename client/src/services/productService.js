import api from '../lib/api';

export const productService = {
  getAll: (params) => api.get('/api/v1/products', { params }),
  getBySlug: (slug) => api.get(`/api/v1/products/slug/${slug}`),
  getById: (id) => api.get(`/api/v1/products/${id}`),
  getFeatured: () => api.get('/api/v1/products', { params: { featured: true, limit: 8 } }),
  search: (q, params) => api.get('/api/v1/products', { params: { search: q, ...params } }),
  getRelated: (slug) => api.get(`/api/v1/products/slug/${slug}/related`),
  create: (data) => api.post('/api/v1/products', data),
  update: (id, data) => api.put(`/api/v1/products/${id}`, data),
  delete: (id) => api.delete(`/api/v1/products/${id}`),
  updateStock: (id, qty) => api.patch(`/api/v1/products/${id}/stock`, { quantity: qty }),
};
