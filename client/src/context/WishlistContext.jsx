import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

const GUEST_WISHLIST_KEY = 'omastra_wishlist';

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/v1/wishlist')
        .then(({ data }) => setItems(data.data?.items || data.items || []))
        .catch(() => setItems([]));
    } else {
      try {
        setItems(JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]'));
      } catch {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  const toggle = useCallback(async (product) => {
    const isWishlisted = items.some((i) => (i._id || i) === product._id || i.product?._id === product._id);

    if (isAuthenticated) {
      try {
        if (isWishlisted) {
          const { data } = await api.delete(`/api/v1/wishlist/${product._id}`);
          setItems(data.data?.items || data.items || []);
          toast('Removed from wishlist', { icon: '💔' });
        } else {
          const { data } = await api.post('/api/v1/wishlist', { productId: product._id });
          setItems(data.data?.items || data.items || []);
          toast.success('Added to wishlist!');
        }
      } catch {
        toast.error('Could not update wishlist');
      }
    } else {
      setItems((prev) => {
        let newItems;
        if (isWishlisted) {
          newItems = prev.filter((i) => i._id !== product._id);
          toast('Removed from wishlist', { icon: '💔' });
        } else {
          newItems = [...prev, product];
          toast.success('Added to wishlist!');
        }
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [items, isAuthenticated]);

  const isWishlisted = useCallback((productId) => {
    return items.some((i) => (i.product?._id || i._id) === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}

export default WishlistContext;


