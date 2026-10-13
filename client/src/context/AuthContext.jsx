import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('omastra_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify session on mount by calling /me (uses HttpOnly cookie automatically)
  useEffect(() => {
    api.get('/api/v1/auth/me')
      .then(({ data }) => {
        const u = data.data || data.user;
        setUser(u);
        localStorage.setItem('omastra_user', JSON.stringify(u));
      })
      .catch(() => {
        // Cookie not present or expired — clear local user cache
        localStorage.removeItem('omastra_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/v1/auth/login', { email, password });
    const u = data.data || data.user;
    setUser(u);
    localStorage.setItem('omastra_user', JSON.stringify(u));
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/api/v1/auth/register', { name, email, password });
    const u = data.data || data.user;
    setUser(u);
    localStorage.setItem('omastra_user', JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch { /* best-effort */ }
    localStorage.removeItem('omastra_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const { data } = await api.put('/api/v1/users/profile', updates);
    const u = data.data || data.user;
    setUser(u);
    localStorage.setItem('omastra_user', JSON.stringify(u));
    return u;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;


