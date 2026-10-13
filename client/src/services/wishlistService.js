import api from '../lib/api';

export const wishlistService = {
  get: () => api.get('/api/v1/wishlist'),
  add: (productId) => api.post('/api/v1/wishlist', { productId }),
  remove: (productId) => api.delete(`/api/v1/wishlist/${productId}`),
};
