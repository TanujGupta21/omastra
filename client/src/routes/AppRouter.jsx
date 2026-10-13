import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import StorefrontLayout from '../components/layout/StorefrontLayout'
import AdminLayout from '../components/layout/AdminLayout'
import { ProtectedRoute, AdminRoute, GuestRoute } from './ProtectedRoute'
import { Spinner } from '../components/ui/Spinner'

// --- Storefront pages (lazy loaded) ---
const HomePage = lazy(() => import('../pages/home/HomePage'))
const ShopPage = lazy(() => import('../pages/shop/ShopPage'))
const CategoryPage = lazy(() => import('../pages/shop/CategoryPage'))
const ProductDetailPage = lazy(() => import('../pages/product/ProductDetailPage'))
const SearchPage = lazy(() => import('../pages/shop/SearchPage'))
const CartPage = lazy(() => import('../pages/cart/CartPage'))
const WishlistPage = lazy(() => import('../pages/wishlist/WishlistPage'))
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('../pages/checkout/OrderSuccessPage'))

// Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))

// Account
const AccountPage = lazy(() => import('../pages/account/AccountPage'))
const OrdersPage = lazy(() => import('../pages/account/OrdersPage'))
const OrderDetailPage = lazy(() => import('../pages/account/OrderDetailPage'))
const AddressesPage = lazy(() => import('../pages/account/AddressesPage'))
const ProfilePage = lazy(() => import('../pages/account/ProfilePage'))

// Static
const AboutPage = lazy(() => import('../pages/static/AboutPage'))
const ContactPage = lazy(() => import('../pages/static/ContactPage'))
const FAQPage = lazy(() => import('../pages/static/FAQPage'))
const ShippingPage = lazy(() => import('../pages/static/ShippingPage'))
const PrivacyPage = lazy(() => import('../pages/static/PrivacyPage'))
const TermsPage = lazy(() => import('../pages/static/TermsPage'))
const TrackOrderPage = lazy(() => import('../pages/static/TrackOrderPage'))

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/DashboardPage'))
const AdminProducts = lazy(() => import('../pages/admin/ProductsPage'))
const AdminProductForm = lazy(() => import('../pages/admin/ProductFormPage'))
const AdminCategories = lazy(() => import('../pages/admin/CategoriesPage'))
const AdminOrders = lazy(() => import('../pages/admin/AdminOrdersPage'))
const AdminOrderDetail = lazy(() => import('../pages/admin/AdminOrderDetailPage'))
const AdminCustomers = lazy(() => import('../pages/admin/CustomersPage'))
const AdminCoupons = lazy(() => import('../pages/admin/CouponsPage'))
const AdminReviews = lazy(() => import('../pages/admin/ReviewsPage'))
const AdminInventory = lazy(() => import('../pages/admin/InventoryPage'))
const AdminAnalytics = lazy(() => import('../pages/admin/AnalyticsPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Storefront ─────────────────────── */}
        <Route element={<StorefrontLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />

          {/* Guest-only auth routes */}
          <Route path="auth/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="auth/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Checkout (guest + auth) */}
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />

          {/* Protected account routes */}
          <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="account/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="account/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="account/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
          <Route path="account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>

        {/* ── Admin ──────────────────────────── */}
        <Route
          path="admin"
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}


