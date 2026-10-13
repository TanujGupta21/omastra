import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Package, MessageCircle, Truck, RefreshCcw } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// ── Reusable Reveal wrapper (same pattern as HomePage) ─────────────
function Reveal({ children, className = '', direction = 'up', delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  const cls =
    direction === 'left'  ? 'reveal-left'  :
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

// ── Section label (eyebrow text) ──────────────────────────────────
function Label({ children }) {
  return (
    <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
      {children}
    </span>
  )
}

// ── 1. Hero ───────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200/60" style={{ backgroundColor: '#F1F2F2' }}>
      {/* Subtle diagonal ambient light streak on the far right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/[0.03] z-0" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 min-h-[580px] lg:min-h-[660px] xl:min-h-[700px] flex items-center py-16 lg:py-0 z-10">
        
        {/* Left Column — Headline, Copy & CTA */}
        <div className="w-full lg:max-w-lg xl:max-w-xl z-20 pt-4 lg:pt-0">
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-6 h-[1.5px] bg-[#8C93A0]" />
              <span className="text-[#8C93A0] text-xs font-semibold tracking-[0.25em] uppercase">
                DISCIPLINE BUILDS FREEDOM
              </span>
            </div>
          </div>

          <h1
            className="animate-slide-up font-display font-black text-black tracking-tight uppercase leading-[0.88] mb-6 text-[clamp(2.75rem,5.5vw,5.25rem)]"
            style={{ animationDelay: '80ms' }}
          >
            BUILT FOR<br />
            THE WORK<br />
            NOBODY<br />
            <span className="text-[#9AA1AD]">SEES.</span>
          </h1>

          <p
            className="animate-slide-up text-[#626875] text-base sm:text-lg leading-relaxed max-w-md mb-8 font-normal"
            style={{ animationDelay: '160ms' }}
          >
            Nutrition for the days you show up, the reps you finish, and the goals you refuse to abandon.
          </p>

          <div
            className="animate-slide-up flex items-center"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#0A0A0A] text-white font-bold text-sm tracking-wide rounded-xl hover:bg-black transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-black/10 group"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Center-Right — Muscular Grayscale Athlete (matches reference scale and positioning) */}
        <div
          className="mt-12 lg:mt-0 lg:absolute lg:bottom-0 lg:left-[55%] xl:left-[54%] lg:-translate-x-1/2 z-10 flex items-end justify-center pointer-events-none select-none animate-slide-in-right"
          style={{ animationDelay: '100ms' }}
        >
          <img
            src="/about/athlete-portrait.png"
            alt="OMASTRA athlete — Built for the work nobody sees"
            className="w-auto h-[440px] sm:h-[500px] md:h-[560px] lg:h-[620px] xl:h-[680px] max-w-none object-contain object-bottom filter contrast-105 drop-shadow-[0_20px_35px_rgba(0,0,0,0.06)]"
            fetchPriority="high"
          />
        </div>

        {/* Far Right Column — Motivational Vertical Stack (Desktop) */}
        <div
          className="hidden lg:flex flex-col items-start gap-1 absolute right-6 sm:right-10 lg:right-14 bottom-14 xl:bottom-16 z-20 text-[11px] font-semibold tracking-[0.25em] text-[#8C93A0] uppercase select-none animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <span>SAME</span>
          <span>PERSON</span>
          <span>BUT A</span>
          <span>STRONGER</span>
          <span>MINDSET</span>
          <span className="w-6 h-[1.5px] bg-[#8C93A0] mt-1.5" />
        </div>

      </div>
    </section>
  )
}

// ── 2. Our Story ─────────────────────────────────────────────────
function OurStorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — photograph */}
          <Reveal direction="left" className="relative">
            <div
              className="rounded-3xl overflow-hidden aspect-[3/4]"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <img
                src="/about/supplements-still.jpg"
                alt="Premium OMASTRA supplement products"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Caption strip */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Products</p>
              <p className="font-display font-bold text-black text-sm">Clean ingredients. Clear labels.</p>
            </div>
          </Reveal>

          {/* Right — copy */}
          <div className="space-y-6">
            <Reveal>
              <Label>Our Story</Label>
              <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
                More than a<br />supplement.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-gray-500 leading-relaxed text-base">
                OMASTRA exists because we believe training deserves better nutrition — nutrition that does not rely on inflated claims, proprietary blends, or flashy marketing to justify its place in your routine.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-gray-500 leading-relaxed text-base">
                Our products are designed for one purpose: to reliably fuel your training. Whether that is a 5 AM session before the rest of the world wakes up, or a weekend workout when your schedule finally cleared — we are here for those moments, not the highlight reel.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <p className="text-gray-500 leading-relaxed text-base">
                Every ingredient is disclosed, every dose is intentional, and every product is made with the same standard: if it does not help you perform better, it does not belong in the formula.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="pt-4 border-t border-gray-100">
                <blockquote className="font-display text-xl font-bold text-black leading-snug tracking-tight">
                  "Nutrition that fits real training. No compromises."
                </blockquote>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 3. Philosophy ─────────────────────────────────────────────────
const PRINCIPLES = [
  {
    number: '01',
    title: 'QUALITY FIRST',
    desc: 'We list every ingredient and every dose on the label. No fillers hidden behind proprietary blend labels — only what is scientifically justified and clearly disclosed.',
  },
  {
    number: '02',
    title: 'NO UNNECESSARY HYPE',
    desc: 'We do not promise overnight transformations. Our product descriptions are accurate, our claims are honest, and we trust you to make your own informed decisions.',
  },
  {
    number: '03',
    title: 'BUILT FOR CONSISTENCY',
    desc: 'Supplements work when you do — consistently, over time. Our range is priced and designed to be a reliable part of your routine, not a one-off purchase.',
  },
]

function PhilosophySection() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        <Reveal className="max-w-xl mb-14">
          <Label>Our Philosophy</Label>
          <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
            What we stand for.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PRINCIPLES.map(({ number, title, desc }, i) => (
            <Reveal key={number} delay={i * 100} direction="scale">
              <div className="group h-full bg-white border border-gray-200 rounded-2xl p-8 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                {/* Editorial number */}
                <span className="font-display text-7xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors leading-none select-none block mb-4">
                  {number}
                </span>
                <h3 className="font-display text-base font-bold text-black mb-3 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 4. Who We Build For ──────────────────────────────────────────
const WHO_ITEMS = [
  { label: 'First-timers',        desc: 'Starting out and figuring it out. We make it simple.' },
  { label: 'Students',            desc: 'Tight budgets, big goals. Priced to stay in your routine.' },
  { label: 'Everyday athletes',   desc: 'Monday to Friday. Showing up consistently, week after week.' },
  { label: 'Experienced lifters', desc: 'You know what works. We give you exactly that, nothing extra.' },
]

function WhoWeServeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            <Reveal>
              <Label>Who We Build For</Label>
              <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
                For every version<br />of you that refuses<br />to quit.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-gray-500 leading-relaxed">
                OMASTRA is not for a specific type of athlete. It is for anyone who decides to show up — beginners figuring out their first routine, students juggling training with packed schedules, and experienced lifters who have been at it for years. We make the same product for all of you.
              </p>
            </Reveal>

            <div className="space-y-0">
              {WHO_ITEMS.map(({ label, desc }, i) => (
                <Reveal key={label} delay={120 + i * 70}>
                  <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-black text-sm mb-0.5">{label}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right — photograph */}
          <Reveal direction="right">
            <div
              className="rounded-3xl overflow-hidden aspect-[16/10]"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <img
                src="/about/athlete-training.jpg"
                alt="Diverse athletes training in a gym"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── 5. Trust & Transparency ──────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon: CheckCircle2,
    title: 'Transparent Ingredients',
    desc: 'Every ingredient and its exact dose is printed on our labels. No blends, no hidden amounts.',
  },
  {
    icon: Package,
    title: 'Authentic Products',
    desc: 'All products are dispatched directly from our verified warehouse with tamper-evident packaging.',
  },
  {
    icon: MessageCircle,
    title: 'Straightforward Pricing',
    desc: 'What you see is what you pay. No surprise charges or inflated original prices.',
  },
  {
    icon: Truck,
    title: 'Reliable Shipping',
    desc: 'Standard delivery in 3-5 business days. Free shipping on orders above Rs. 999.',
  },
  {
    icon: RefreshCcw,
    title: 'Clear Return Policy',
    desc: 'Returns accepted within 7 days of delivery for sealed, unopened products.',
  },
  {
    icon: MessageCircle,
    title: 'Accessible Support',
    desc: 'Questions? Our support team responds to every query. No bots, no scripted non-answers.',
  },
]

function TrustSection() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        <Reveal className="max-w-xl mb-14">
          <Label>Trust &amp; Transparency</Label>
          <h2 className="font-display text-4xl md:text-5xl text-black font-bold tracking-tight leading-tight">
            Know what fuels you.
          </h2>
          <p className="text-gray-500 mt-4 leading-relaxed text-sm max-w-md">
            We hold ourselves to a simple standard: say what we do, and do what we say.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 80} direction="scale">
              <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover h-full">
                <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:border-black transition-all duration-300">
                  <Icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-black text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 6. CTA ────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Reveal>
          <p className="font-display text-xs text-white/20 uppercase tracking-[0.3em] mb-4 font-semibold">
            OMASTRA Nutrition
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-white font-bold tracking-tight leading-none mb-6">
            SHOW UP.<br />
            <span className="text-gray-500">PUT IN THE WORK.</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-sm mx-auto text-sm">
            Find what fits your training. Keep showing up.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-9 py-4 bg-white text-black font-bold rounded-2xl transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 text-sm"
          >
            EXPLORE PRODUCTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

// ── Main export ───────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <OurStorySection />
      <PhilosophySection />
      <WhoWeServeSection />
      <TrustSection />
      <CTASection />
    </>
  )
}
