import api from '../lib/api';

export const authService = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  register: (name, email, password) => api.post('/api/v1/auth/register', { name, email, password }),
  logout: () => api.post('/api/v1/auth/logout'),
  me: () => api.get('/api/v1/auth/me'),
  updateProfile: (data) => api.put('/api/v1/auth/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/api/v1/auth/change-password', { currentPassword, newPassword }),
  forgotPassword: (email) => api.post('/api/v1/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/v1/auth/reset-password', { token, password }),
};
