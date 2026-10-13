import { useState } from 'react'
import { Mail, Phone, MessageSquare, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// ── Reusable Scroll Reveal Wrapper (identical to AboutPage & HomePage) ─
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

// ── Section Label / Eyebrow (identical to AboutPage & HomePage) ──────
function Label({ children }) {
  return (
    <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
      {children}
    </span>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSent(true)
      toast.success("Message sent! We'll get back to you within 24 hours.")
    } catch {
      toast.error('Could not send message. Please email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSent(false)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="relative bg-white overflow-hidden min-h-[calc(100vh-64px)]">
      {/* Subtle background technical grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#f9f9f9_1px,transparent_1px),linear-gradient(to_right,#f9f9f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-50 z-0" />

      {/* Faint oversized OMASTRA typographic watermark */}
      <div
        className="pointer-events-none absolute right-4 bottom-12 font-display font-black text-[clamp(6rem,14vw,12rem)] leading-none text-gray-100/60 tracking-tighter select-none z-0"
        aria-hidden="true"
      >
        OMASTRA
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 z-10">

        {/* 1. Header Section */}
        <Reveal className="max-w-2xl mb-12 sm:mb-16">
          <Label>SUPPORT / 01 · WE'RE HERE TO HELP</Label>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-black font-extrabold tracking-tight leading-tight mb-4">
            LET'S TALK.
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Questions about your order, our products, or finding the right nutrition for your training? We'd love to hear from you.
          </p>
        </Reveal>

        {/* 2. Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column — Contact Information Cards (5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <Reveal delay={60}>
              <a
                href="mailto:support@omastra.in"
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <Mail className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors">
                    Email Support
                  </span>
                </div>
                <h3 className="font-display font-bold text-black text-base mb-1 tracking-tight group-hover:underline">
                  support@omastra.in
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct email response within 24 hours
                </p>
              </a>
            </Reveal>

            {/* Phone Card */}
            <Reveal delay={120}>
              <a
                href="tel:+919876543210"
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <Phone className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors">
                    Phone Support
                  </span>
                </div>
                <h3 className="font-display font-bold text-black text-base mb-1 tracking-tight group-hover:underline">
                  +91 98765 43210
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Mon–Sat, 9:00 AM – 6:00 PM IST
                </p>
              </a>
            </Reveal>

            {/* Live Chat Card */}
            <Reveal delay={180}>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                    Coming soon
                  </span>
                </div>
                <h3 className="font-display font-bold text-black text-base mb-1 tracking-tight">
                  Direct Chat
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Available soon for in-app real-time assistance
                </p>
              </div>
            </Reveal>

            {/* Order Inquiries Note */}
            <Reveal delay={240}>
              <div className="rounded-2xl p-5 border border-dashed border-gray-200 bg-gray-50/50 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-black uppercase tracking-wider mb-0.5">Order Inquiries</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Have your order ID ready so our team can immediately look up your shipment and resolve any issue.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column — Message Form (7 columns) */}
          <div className="lg:col-span-7">
            <Reveal delay={100} direction="scale">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
                {sent ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <Label>Confirmation</Label>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-black tracking-tight mb-2">
                      Message Received
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
                      Thank you for reaching out. A confirmation has been logged and our team will get back to{' '}
                      <span className="font-semibold text-black">{form.email}</span> within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 text-black font-semibold rounded-xl text-sm transition-all duration-200 hover:border-black hover:bg-gray-50"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-black tracking-tight mb-1">
                        Send a Message
                      </h2>
                      <p className="text-xs text-gray-400">
                        Fill in your details below and our specialists will respond directly.
                      </p>
                    </div>

                    {/* Name & Email Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                          Name <span className="text-gray-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                          Email <span className="text-gray-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                        placeholder="Order query, product recommendation, or feedback"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                        Message <span className="text-gray-400">*</span>
                      </label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-all resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                        placeholder="How can we assist your training and routine?"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <span>SEND MESSAGE</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center leading-normal">
                      We value your privacy. Your information is never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </div>
  )
}
