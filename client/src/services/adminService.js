import api from '../lib/api';

export const adminService = {
  // Dashboard — GET /api/v1/admin/dashboard
  getDashboardStats: (params) => api.get('/api/v1/admin/dashboard', { params }),

  // Analytics — GET /api/v1/admin/analytics
  getAnalytics: (params) => api.get('/api/v1/admin/analytics', { params }),

  // Products — managed via /api/v1/products (admin-guarded on write)
  getProducts: (params) => api.get('/api/v1/products', { params }),
  getProduct: (id) => api.get(`/api/v1/products/${id}`),
  createProduct: (data) => api.post('/api/v1/products', data),
  updateProduct: (id, data) => api.put(`/api/v1/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/v1/products/${id}`),

  // Categories — GET/POST/PUT/DELETE /api/v1/categories
  getCategories: (params) => api.get('/api/v1/categories', { params }),
  createCategory: (data) => api.post('/api/v1/categories', data),
  updateCategory: (id, data) => api.put(`/api/v1/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/v1/categories/${id}`),

  // Orders — admin routes
  getOrders: (params) => api.get('/api/v1/orders', { params }),
  getOrder: (id) => api.get(`/api/v1/orders/${id}`),
  updateOrderStatus: (id, data) => api.patch(`/api/v1/orders/${id}/status`, data),

  // Customers — GET /api/v1/admin/customers
  getCustomers: (params) => api.get('/api/v1/admin/customers', { params }),
  updateCustomerStatus: (id, isActive) =>
    api.patch(`/api/v1/admin/customers/${id}/status`, { isActive }),

  // Coupons — GET/POST/PUT/DELETE /api/v1/coupons
  getCoupons: (params) => api.get('/api/v1/coupons', { params }),
  createCoupon: (data) => api.post('/api/v1/coupons', data),
  updateCoupon: (id, data) => api.put(`/api/v1/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/api/v1/coupons/${id}`),

  // Reviews — GET /api/v1/reviews, PATCH /api/v1/reviews/:id/moderate, DELETE /api/v1/reviews/:id
  getReviews: (params) => api.get('/api/v1/reviews', { params }),
  moderateReview: (id, action) =>
    api.patch(`/api/v1/reviews/${id}/moderate`, { isApproved: action === 'approve' }),
  deleteReview: (id) => api.delete(`/api/v1/reviews/${id}`),

  // Inventory — POST /api/v1/inventory/adjust, GET /api/v1/inventory/logs
  getInventoryLogs: (params) => api.get('/api/v1/inventory/logs', { params }),
  adjustInventory: (data) => api.post('/api/v1/inventory/adjust', data),
};
