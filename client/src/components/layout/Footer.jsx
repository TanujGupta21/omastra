import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react'

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Whey Protein', href: '/categories/whey-protein' },
    { label: 'Creatine', href: '/categories/creatine' },
    { label: 'Pre-Workout', href: '/categories/pre-workout' },
    { label: 'Wellness', href: '/categories/wellness' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Lab Reports', href: '/lab-reports' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Support: [
    { label: 'FAQs', href: '/faq' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-white tracking-tight">OMASTRA</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Science-backed sports nutrition for athletes and everyday performers across India. Clean ingredients. Real results.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button className="px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-2">No spam. Unsubscribe anytime.</p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="font-display font-bold text-white text-sm mb-4 tracking-tight">{section}</p>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} OMASTRA Nutrition. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Youtube, href: '#' },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all duration-200">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}


