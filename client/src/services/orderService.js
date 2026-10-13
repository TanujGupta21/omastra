import api from '../lib/api';

export const orderService = {
  getAll: (params) => api.get('/api/v1/orders', { params }),
  getById: (id) => api.get(`/api/v1/orders/${id}`),
  create: (data) => api.post('/api/v1/orders', data),
  cancel: (id) => api.put(`/api/v1/orders/${id}/cancel`),
  track: (id) => api.get(`/api/v1/orders/${id}/track`),
  // Admin
  adminGetAll: (params) => api.get('/api/v1/admin/orders', { params }),
  adminUpdate: (id, data) => api.put(`/api/v1/admin/orders/${id}`, data),
};
