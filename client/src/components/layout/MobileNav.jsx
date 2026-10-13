import { Link } from 'react-router-dom';
import { X, ChevronRight, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function MobileNav({ isOpen, onClose, categories = [] }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center justify-between py-3 border-b border-gray-100 text-sm text-gray-600 hover:text-black transition-colors"
    >
      {label}
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </Link>
  );

  return (
    <>
      <div
        className={cn('fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ boxShadow: '4px 0 40px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="font-display text-xl font-bold text-black tracking-tight">OMASTRA</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info / Auth */}
        {isAuthenticated ? (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-bold text-black">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        ) : (
          <div className="flex gap-3 px-6 py-4 border-b border-gray-100">
            <Link to="/auth/login" onClick={onClose} className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm text-black font-semibold hover:border-black transition-colors">
              Login
            </Link>
            <Link to="/auth/register" onClick={onClose} className="flex-1 text-center py-2.5 bg-black rounded-xl text-sm text-white font-semibold hover:bg-gray-800 transition-colors">
              Register
            </Link>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {navLink('/shop', 'Shop All Products')}

          <div className="py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</p>
            <div className="space-y-0">
              {categories.map((cat) => navLink(`/categories/${cat.slug}`, cat.name))}
            </div>
          </div>

          {navLink('/about', 'About OMASTRA')}
          {navLink('/contact', 'Contact Us')}
          {navLink('/faq', 'FAQ')}
          {navLink('/shipping', 'Shipping & Returns')}

          {isAuthenticated && (
            <div className="py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">My Account</p>
              {navLink('/account', 'Account Overview')}
              {navLink('/account/orders', 'My Orders')}
              {navLink('/wishlist', `Wishlist (${wishlistCount})`)}
              {navLink('/account/addresses', 'Addresses')}
            </div>
          )}
        </nav>

        {/* Bottom bar */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-6 justify-center">
          <Link to="/cart" onClick={onClose} className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-medium">Cart {itemCount > 0 && `(${itemCount})`}</span>
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
          </Link>
          {isAuthenticated && (
            <button
              onClick={() => { logout(); onClose(); }}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}


