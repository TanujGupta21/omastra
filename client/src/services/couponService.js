import api from '../lib/api';

export const couponService = {
  validate: (code, subtotal) => api.post('/api/v1/coupons/validate', { code, subtotal }),
  getAll: (params) => api.get('/api/v1/coupons', { params }),
  create: (data) => api.post('/api/v1/coupons', data),
  update: (id, data) => api.put(`/api/v1/coupons/${id}`, data),
  delete: (id) => api.delete(`/api/v1/coupons/${id}`),
};
