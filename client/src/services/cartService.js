import api from '../lib/api';

export const cartService = {
  get: () => api.get('/api/v1/cart'),
  add: (productId, variantId, quantity) =>
    api.post('/api/v1/cart', { productId, variantId, quantity }),
  update: (itemId, quantity) => api.put(`/api/v1/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/api/v1/cart/${itemId}`),
  clear: () => api.delete('/api/v1/cart'),
  merge: (items) => api.post('/api/v1/cart/merge', { items }),
  applyCoupon: (code) => api.post('/api/v1/cart/coupon', { code }),
  removeCoupon: () => api.delete('/api/v1/cart/coupon'),
};
