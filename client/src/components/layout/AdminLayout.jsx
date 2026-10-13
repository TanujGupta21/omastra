import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  Ticket, Star, BarChart2, Warehouse, Settings, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-display text-xl tracking-wider text-black">OMA</span>
            <span className="w-2 h-2 rounded-full bg-black shadow-sm shadow-black/15" />
            <span className="font-display text-xl tracking-wider text-black">STRA</span>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5 font-semibold tracking-wide">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon, exact }) => (
            <NavLink
              key={href}
              to={href}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-black/20 text-gray-500 font-semibold border-l-2 border-black'
                    : 'text-gray-500 hover:text-black hover:bg-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-black/20 text-gray-500 flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-black truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/admin" className="hover:text-black transition-colors">Admin</Link>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


