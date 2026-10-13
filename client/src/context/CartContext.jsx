import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'omastra_guest_cart';

function loadGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart
  useEffect(() => {
    if (isAuthenticated) {
      fetchServerCart();
    } else {
      setItems(loadGuestCart());
    }
  }, [isAuthenticated]);

  const fetchServerCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/v1/cart');
      setItems(data.data?.items || data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart on login
  useEffect(() => {
    if (isAuthenticated) {
      const guest = loadGuestCart();
      if (guest.length > 0) {
        api.post('/api/v1/cart/merge', { items: guest })
          .then(() => {
            localStorage.removeItem(GUEST_CART_KEY);
            fetchServerCart();
          })
          .catch(() => fetchServerCart());
      } else {
        fetchServerCart();
      }
    }
  }, [user?._id]);

  const persistGuestCart = (newItems) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
  };

  const addItem = useCallback(async (product, variant, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.post('/api/v1/cart', {
          productId: product._id,
          variantId: variant?._id,
          quantity,
        });
        setItems(data.data?.items || data.items || []);
        toast.success('Added to cart!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not add to cart');
      }
    } else {
      setItems((prev) => {
        const key = `${product._id}-${variant?._id || 'default'}`;
        const existing = prev.find((i) => i.key === key);
        let newItems;
        if (existing) {
          newItems = prev.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          newItems = [
            ...prev,
            {
              key,
              product,
              variant,
              quantity,
              price: variant?.price || product.price,
            },
          ];
        }
        persistGuestCart(newItems);
        toast.success('Added to cart!');
        return newItems;
      });
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.delete(`/api/v1/cart/${itemId}`);
        setItems(data.data?.items || data.items || []);
        toast.success('Removed from cart');
      } catch {
        toast.error('Could not remove item');
      }
    } else {
      setItems((prev) => {
        const newItems = prev.filter((i) => i.key !== itemId);
        persistGuestCart(newItems);
        return newItems;
      });
      toast.success('Removed from cart');
    }
  }, [isAuthenticated]);

  const updateQty = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);
    if (isAuthenticated) {
      try {
        const { data } = await api.put(`/api/v1/cart/${itemId}`, { quantity });
        setItems(data.data?.items || data.items || []);
      } catch {
        toast.error('Could not update quantity');
      }
    } else {
      setItems((prev) => {
        const newItems = prev.map((i) =>
          i.key === itemId ? { ...i, quantity } : i
        );
        persistGuestCart(newItems);
        return newItems;
      });
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/api/v1/cart');
        setItems([]);
      } catch {}
    } else {
      setItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [isAuthenticated]);

  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const total = items.reduce((sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export default CartContext;


