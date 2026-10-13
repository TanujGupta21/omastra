import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut, Package, MapPin, Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useCategories } from '../../hooks/useProducts';
import { cn } from '../../lib/utils';
import MobileNav from './MobileNav';

function OmastraLogo() {
  return (
    <Link to="/" className="flex items-center gap-1 group">
      <span className="font-display text-xl font-bold tracking-tight text-black group-hover:text-gray-600 transition-colors">
        OMASTRA
      </span>
    </Link>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { data: rawCategories } = useCategories();
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const searchRef = useRef();
  const userDropRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const iconBtn = 'p-2 text-gray-500 hover:text-black transition-colors rounded-lg hover:bg-gray-100';
  const dropLink = 'flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors';

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-black text-white text-center text-xs font-medium py-2 px-4 tracking-wide">
        Free shipping on orders above ₹999 &nbsp;·&nbsp; India-wide delivery in 3–5 days
      </div>

      <header className={cn(
        'sticky top-0 z-40 transition-all duration-300 bg-white border-b',
        scrolled ? 'border-gray-200 shadow-sm' : 'border-gray-100'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <OmastraLogo />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {['Shop', 'About', 'Contact'].map((item) => (
                item === 'Categories' ? null :
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-sm text-gray-500 hover:text-black font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setCatDropOpen(true)}
                onMouseLeave={() => setCatDropOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-black font-medium transition-colors">
                  Categories
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', catDropOpen && 'rotate-180')} />
                </button>
                {catDropOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    {categories.slice(0, 10).map((cat) => (
                      <Link key={cat._id} to={`/categories/${cat.slug}`} className={dropLink}>
                        {cat.name}
                      </Link>
                    ))}
                    <Link to="/shop" className="flex items-center px-4 py-2.5 text-sm text-black font-semibold hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1">
                      View All →
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-all"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className={iconBtn}>
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className={iconBtn}>
                  <Search className="w-5 h-5" />
                </button>
              )}

              <Link to="/wishlist" className={cn(iconBtn, 'relative')}>
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className={cn(iconBtn, 'relative')}>
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              <div className="relative hidden md:block" ref={userDropRef}>
                <button onClick={() => setUserDropOpen(!userDropOpen)} className={iconBtn}>
                  <User className="w-5 h-5" />
                </button>
                {userDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setUserDropOpen(false)} className={dropLink}><User className="w-4 h-4" /> My Account</Link>
                        <Link to="/account/orders" onClick={() => setUserDropOpen(false)} className={dropLink}><Package className="w-4 h-4" /> Orders</Link>
                        <Link to="/wishlist" onClick={() => setUserDropOpen(false)} className={dropLink}><Heart className="w-4 h-4" /> Wishlist</Link>
                        <Link to="/account/addresses" onClick={() => setUserDropOpen(false)} className={dropLink}><MapPin className="w-4 h-4" /> Addresses</Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-black font-semibold hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserDropOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth/login" onClick={() => setUserDropOpen(false)} className={dropLink}>Login</Link>
                        <Link to="/auth/register" onClick={() => setUserDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-black font-semibold hover:bg-gray-50 transition-colors">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setMobileOpen(true)} className={cn(iconBtn, 'md:hidden')}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
    </>
  );
}


