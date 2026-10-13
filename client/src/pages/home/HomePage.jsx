import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Truck, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import ProductCard from '../../components/product/ProductCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// ── Reusable Scroll Reveal Wrapper (identical to AboutPage) ───────
function Reveal({ children, className = '', direction = 'up', delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  const cls =
    direction === 'left' ? 'reveal-left' :
      direction === 'right' ? 'reveal-right' :
        direction === 'scale' ? 'reveal-scale' :
          'reveal'
  return (
    <div
      ref={ref}
      className={`${cls} ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Section Label / Eyebrow (identical to AboutPage) ──────────────
function Label({ children }) {
  return (
    <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
      {children}
    </span>
  )
}

// ── Fallback Products (Rock-solid offline/loading safety) ───────────
const FALLBACK_PRODUCTS = [
  {
    _id: 'omastra-whey-pro-classic-blend',
    id: 'omastra-whey-pro-classic-blend',
    name: 'OMASTRA Whey Pro — Classic Blend',
    slug: 'omastra-whey-pro-classic-blend',
    category: { name: 'Whey Protein', slug: 'whey-protein' },
    image: '/products/whey-pro.png',
    images: [{ url: '/products/whey-pro.png', alt: 'OMASTRA Whey Pro — Classic Blend', isPrimary: true }],
    variants: [
      { sku: 'WP-CHOC-1KG', flavor: 'Chocolate Fudge', size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 120 }
    ],
    price: 1799,
    originalPrice: 2199,
    stock: 120,
    averageRating: 4.8,
    reviewCount: 120,
    shortDescription: 'A high-quality whey concentrate + isolate blend for everyday training.',
  },
  {
    _id: 'omastra-creatine-monohydrate',
    id: 'omastra-creatine-monohydrate',
    name: 'OMASTRA Creatine Monohydrate',
    slug: 'omastra-creatine-monohydrate',
    category: { name: 'Creatine', slug: 'creatine' },
    image: '/products/creatine.png',
    images: [{ url: '/products/creatine.png', alt: 'OMASTRA Creatine Monohydrate', isPrimary: true }],
    variants: [
      { sku: 'CR-UNFL-250G', flavor: 'Unflavored', size: '250g', servings: 50, price: 699, originalPrice: 899, stock: 95 }
    ],
    price: 699,
    originalPrice: 899,
    stock: 95,
    averageRating: 4.9,
    reviewCount: 210,
    shortDescription: 'Pure micronised creatine monohydrate. 5g per serving with zero additives.',
  },
  {
    _id: 'omastra-whey-isolate-90',
    id: 'omastra-whey-isolate-90',
    name: 'OMASTRA Whey Isolate 90',
    slug: 'omastra-whey-isolate-90',
    category: { name: 'Whey Protein', slug: 'whey-protein' },
    image: '/products/whey-isolate.png',
    images: [{ url: '/products/whey-isolate.png', alt: 'OMASTRA Whey Isolate 90', isPrimary: true }],
    variants: [
      { sku: 'WI90-CHOC-1KG', flavor: 'Dark Chocolate', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 75 }
    ],
    price: 2499,
    originalPrice: 2999,
    stock: 75,
    averageRating: 4.9,
    reviewCount: 88,
    shortDescription: 'Ultra-filtered whey isolate with 90% protein purity and minimal lactose.',
  },
  {
    _id: 'omastra-nitropre-pre-workout-igniter',
    id: 'omastra-nitropre-pre-workout-igniter',
    name: 'OMASTRA NitroPre — Pre-Workout Igniter',
    slug: 'omastra-nitropre-pre-workout-igniter',
    category: { name: 'Pre-Workout', slug: 'pre-workout' },
    image: '/products/nitropre.png',
    images: [{ url: '/products/nitropre.png', alt: 'OMASTRA NitroPre — Pre-Workout Igniter', isPrimary: true }],
    variants: [
      { sku: 'NP-PUNCH-300G', flavor: 'Fruit Punch', size: '300g', servings: 30, price: 1299, originalPrice: 1599, stock: 60 }
    ],
    price: 1299,
    originalPrice: 1599,
    stock: 60,
    averageRating: 4.6,
    reviewCount: 64,
    shortDescription: 'Clean energy, focus, and pump formula without the harsh crash.',
  },
]

// ── Categories Configuration (Based on actual inventory) ───────────
const CATEGORIES = [
  {
    name: 'Whey Protein',
    slug: 'whey-protein',
    image: '/products/whey-pro.png',
    tagline: 'Fast-absorbing muscle recovery',
    count: '2 Formulas',
  },
  {
    name: 'Plant Protein',
    slug: 'plant-protein',
    image: '/products/plant-fuel.png',
    tagline: 'Clean pea & rice protein fuel',
    count: '1 Formula',
  },
  {
    name: 'Creatine',
    slug: 'creatine',
    image: '/products/creatine.png',
    tagline: 'Pure strength & power output',
    count: '1 Formula',
  },
  {
    name: 'Pre-Workout',
    slug: 'pre-workout',
    image: '/products/nitropre.png',
    tagline: 'Clean sustained energy & focus',
    count: '1 Formula',
  },
  {
    name: 'Electrolytes',
    slug: 'electrolytes',
    image: '/products/hydrocharge.png',
    tagline: 'Hydration & endurance support',
    count: '1 Formula',
  },
  {
    name: 'Recovery & Wellness',
    slug: 'wellness',
    image: '/products/omega-3.png',
    tagline: 'Daily essential omega-3 & health',
    count: '2 Formulas',
  },
]

// ── 1. Hero Section (Premium — Matches Reference Image) ─────────────
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-gray-100"
      style={{ backgroundColor: '#FAFAFA' }}
    >
      {/* ── Subtle technical grid overlay ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.028]"
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Oversized "OMASTRA" typographic watermark ─────────────── */}
      <div
        className="pointer-events-none select-none absolute z-0 hidden lg:flex items-center"
        style={{
          right: '-2%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          fontFamily: "'Space Grotesk', 'Manrope', sans-serif",
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(0,0,0,0.055)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        OMASTRA
      </div>

      {/* ── Main layout grid ──────────────────────────────────────── */}
      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center min-h-[88vh] lg:min-h-[82vh] xl:min-h-[78vh] gap-0">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col justify-center py-16 lg:py-0 max-w-[520px]">

            {/* Eyebrow */}
            <div className="animate-slide-up mb-5" style={{ animationDelay: '0ms' }}>
              <span className="text-[#8C93A0] text-[11px] font-bold tracking-[0.28em] uppercase">
                SPORTS NUTRITION
              </span>
            </div>

            {/* Giant editorial headline */}
            <h1
              className="animate-slide-up font-display font-black uppercase leading-[0.9] tracking-tight text-black mb-7"
              style={{
                animationDelay: '60ms',
                fontSize: 'clamp(3.25rem, 7vw, 5.75rem)',
              }}
            >
              BUILT FOR<br />
              YOUR NEXT<br />
              <span style={{ color: '#9AA1AD' }}>LEVEL.</span>
            </h1>

            {/* Body copy */}
            <div className="animate-slide-up mb-8" style={{ animationDelay: '140ms' }}>
              <p className="text-[#525965] text-[15px] leading-relaxed max-w-[360px]">
                Fuel your training. Stay consistent. Keep progressing.
                <br />
                <span className="text-[#7C8490] text-[13px] mt-1 block">
                  Transparent, high-quality sports nutrition engineered for
                  athletes and everyday performers across India.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="animate-slide-up flex flex-wrap gap-3 items-center"
              style={{ animationDelay: '220ms' }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#0A0A0A] text-white font-bold text-[13px] tracking-[0.08em] uppercase rounded-xl hover:bg-black transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
              >
                SHOP SUPPLEMENTS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-black font-semibold text-[13px] tracking-[0.06em] uppercase hover:text-gray-500 transition-colors"
              >
                EXPLORE THE COLLECTION
              </Link>
            </div>

          </div>

          {/* ── RIGHT COLUMN — Product composition ─────────────────── */}
          <div className="relative flex items-end justify-center lg:justify-end pb-0 pt-10 lg:pt-0 lg:pl-8">

            {/* Product image */}
            <div
              className="relative animate-slide-in-right"
              style={{ animationDelay: '100ms' }}
            >
              <img
                src="/products/hero-whey-composition.png"
                alt="OMASTRA Whey Pro — Premium Protein Matrix with stone prop and scoop"
                className="relative z-10 w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] xl:w-[600px] object-contain object-bottom drop-shadow-[0_32px_48px_rgba(0,0,0,0.09)]"
                style={{ maxHeight: '78vh' }}
                fetchPriority="high"
                draggable="false"
              />

              {/* ── Product callout annotation (top-right of tub) ── */}
              <div
                className="absolute hidden sm:flex flex-col items-start z-20 animate-fade-in"
                style={{
                  top: '12%',
                  right: '-10px',
                  animationDelay: '500ms',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-[52px] h-[0.5px] bg-[#888] opacity-70" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#333]">
                      PREMIUM WHEY PROTEIN
                    </span>
                    <span className="text-[8px] text-[#888] tracking-[0.12em] font-medium mt-0.5">
                      25g PROTEIN PER SERVING
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right-side benefit stack ───────────────────────── */}
            <div
              className="hidden xl:flex flex-col gap-4 ml-8 mb-12 animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              {[
                { icon: '⚡', label: 'HIGH PROTEIN' },
                { icon: '◎', label: 'LOW SUGAR' },
                { icon: '✦', label: 'EASY MIXABILITY' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="text-[#9AA1AD] text-sm leading-none">{icon}</span>
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6B7280]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}


// ── 2. Shop by Category Section ────────────────────────────────────
function CategorySection() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <Label>Find Your Fuel</Label>
            <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
              FIND YOUR FUEL.
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-black hover:text-gray-600 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 60} direction="scale">
              <Link
                to={`/categories/${cat.slug}`}
                className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-4 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Image Container with clean background */}
                <div className="relative aspect-square rounded-xl bg-gray-50 flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:bg-gray-100/70 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <h3 className="font-display font-bold text-black text-sm mb-1 leading-snug group-hover:text-gray-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {cat.tagline}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-400">{cat.count}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 3. Featured Products / Bestsellers Section ─────────────────────
function FeaturedProductsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured-bestsellers'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/products', {
          params: { limit: 4, status: 'active' }
        })
        const items = data.data || []
        return items.length > 0 ? items.slice(0, 4) : FALLBACK_PRODUCTS
      } catch (err) {
        return FALLBACK_PRODUCTS
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const products = data && data.length > 0 ? data : FALLBACK_PRODUCTS

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <Label>The Essentials</Label>
            <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
              THE ESSENTIALS.
            </h2>
            <p className="text-gray-500 mt-3 text-sm max-w-lg leading-relaxed">
              Transparently formulated sports nutrition for everyday training. Verified for label accuracy and purity.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-black font-semibold rounded-xl transition-all duration-200 hover:border-black hover:bg-gray-50 text-sm self-start sm:self-auto"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCard key={i} loading />)
            : products.map((product, i) => (
              <Reveal key={product._id || product.id} delay={i * 80} direction="scale">
                <ProductCard product={product} />
              </Reveal>
            ))
          }
        </div>
      </div>
    </section>
  )
}

// ── 4. Brand Statement Section ─────────────────────────────────────
function BrandStatementSection() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy & Philosophy */}
          <div className="space-y-6">
            <Reveal>
              <Label>Brand Statement</Label>
              <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
                NO SHORTCUTS.<br />
                JUST CONSISTENCY.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-gray-500 leading-relaxed text-base">
                Real athletic progress isn’t built on loud marketing, miraculous claims, or proprietary blends. It is forged in the quiet daily discipline of showing up—the early morning sessions, the heavy sets, and the relentless decision to keep going when motivation fades.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-gray-500 leading-relaxed text-base">
                At OMASTRA, we formulate sports nutrition with that exact mindset: every ingredient disclosed, every dose scientifically intentional, and zero shortcuts. Because when you put in honest work, your nutrition should too.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="space-y-3 pt-2">
                {[
                  { title: 'Full Label Transparency', desc: 'Every active ingredient and exact milligram dosage printed on the label.' },
                  { title: 'No Proprietary Blends', desc: 'Zero hidden fillers or cheap ingredients masked behind complex blend names.' },
                  { title: 'Engineered for Routine', desc: 'Priced and formulated to remain a reliable, sustainable part of your daily training.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-black">{item.title}</span>
                      <span className="text-sm text-gray-500"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="pt-6 border-t border-gray-100 flex items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
                >
                  Read Our Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="text-sm text-gray-400 hover:text-black transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — Editorial Gym Photograph (consistent with AboutPage) */}
          <Reveal direction="right" className="relative">
            <div
              className="rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5]"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <img
                src="/about/gym-lifestyle.jpg"
                alt="Focused athlete training in minimalist gym"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Editorial Caption Strip */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Discipline Over Hype</p>
              <p className="font-display font-bold text-black text-sm">Formulated for the work nobody sees.</p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

// ── 5. Why Shop With Us? Section ───────────────────────────────────
const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Product Authenticity',
    desc: 'Dispatched directly from verified storage facilities with tamper-evident packaging. 100% genuine guaranteed.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Dosing',
    desc: 'Every active ingredient and precise dosage is disclosed on our labels. No proprietary blends, no hidden fillers.',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    desc: 'Bank-grade SSL encryption powered by Razorpay. Seamless payment via UPI, major cards, and net banking.',
  },
  {
    icon: Truck,
    title: 'Reliable Shipping & Returns',
    desc: 'Free delivery across India on orders above ₹999. Fast 3–5 day delivery with 7-day returns on sealed products.',
  },
]

function WhyShopWithUsSection() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-xl mb-14">
          <Label>Why Shop With Us</Label>
          <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
            BUILT ON TRUST.
          </h2>
          <p className="text-gray-500 mt-4 leading-relaxed text-sm max-w-md">
            We hold ourselves to a straightforward standard: say what we do, and do what we say.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 80} direction="scale">
              <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <Icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-display font-bold text-black text-sm mb-2">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 6. Featured Collection / Offer Section ────────────────────────
function FeaturedCollectionSection() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal direction="scale">
          <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 p-8 sm:p-12 lg:p-16">
            {/* Subtle grid texture */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#ececec_1px,transparent_1px),linear-gradient(to_right,#ececec_1px,transparent_1px)] bg-[size:36px_36px] opacity-60" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">

              {/* Left Column — Stack Description */}
              <div>
                <Label>Core Performance Stack</Label>
                <h2 className="font-display text-4xl sm:text-5xl text-black font-bold tracking-tight leading-tight mb-4">
                  YOUR TRAINING<br />
                  <span className="text-gray-400">ESSENTIALS.</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6 max-w-md text-sm">
                  The foundational stack for strength, muscle support, and accelerated recovery. Pure Whey Protein paired with Micronised Creatine Monohydrate—scientifically dosed to power your training without unnecessary complexity.
                </p>

                {/* Key Stack Details */}
                <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200">
                    <p className="font-display font-bold text-black text-lg">24g</p>
                    <p className="text-xs text-gray-400">Protein per serving</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200">
                    <p className="font-display font-bold text-black text-lg">5g</p>
                    <p className="text-xs text-gray-400">Micronised Creatine</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200">
                    <p className="font-display font-bold text-black text-lg">100%</p>
                    <p className="text-xs text-gray-400">Disclosed Ingredients</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200">
                    <p className="font-display font-bold text-black text-lg">0g</p>
                    <p className="text-xs text-gray-400">Added Sugars</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-2xl transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                  >
                    EXPLORE THE COLLECTION
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/categories/creatine"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-black font-semibold rounded-2xl transition-all duration-200 hover:border-black hover:bg-gray-50 text-sm"
                  >
                    Shop Creatine
                  </Link>
                </div>
              </div>

              {/* Right Column — Product Duo Showcase */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Product 1: Whey Pro */}
                <Link
                  to="/products/omastra-whey-pro-classic-blend"
                  className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src="/products/whey-pro.png"
                      alt="OMASTRA Whey Pro"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Protein</span>
                    <p className="font-display font-bold text-black text-sm leading-tight mb-1">Whey Pro Blend</p>
                    <p className="text-xs font-semibold text-black">From ₹1,799</p>
                  </div>
                </Link>

                {/* Product 2: Creatine */}
                <Link
                  to="/products/omastra-creatine-monohydrate"
                  className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src="/products/creatine.png"
                      alt="OMASTRA Creatine Monohydrate"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Creatine</span>
                    <p className="font-display font-bold text-black text-sm leading-tight mb-1">Creatine Monohydrate</p>
                    <p className="text-xs font-semibold text-black">From ₹699</p>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── 7. Closing Statement Banner (Matching AboutPage CTA) ───────────
function ClosingBanner() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Reveal>
          <p className="font-display text-xs text-white/30 uppercase tracking-[0.3em] mb-4 font-semibold">
            OMASTRA Nutrition
          </p>
          <h2 className="font-display text-4xl sm:text-6xl text-white font-bold tracking-tight leading-none mb-6">
            SHOW UP.<br />
            <span className="text-gray-500">PUT IN THE WORK.</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-sm mx-auto text-sm">
            Find the formulas that fit your training. Stay consistent. Keep progressing.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-9 py-4 bg-white text-black font-bold rounded-2xl transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 text-sm"
          >
            EXPLORE ALL PRODUCTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

// ── Main HomePage Export ───────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
      <BrandStatementSection />
      <WhyShopWithUsSection />
      <FeaturedCollectionSection />
      <ClosingBanner />
    </>
  )
}
