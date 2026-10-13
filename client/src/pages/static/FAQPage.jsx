import { useState } from 'react'

const FAQS = [
  { category: 'Products', q: 'Are your products safe for beginners?', a: 'Yes. Our products are formulated for everyday fitness enthusiasts at all levels. Start with whey protein or creatine — both have strong safety profiles in the published research literature.' },
  { category: 'Products', q: 'Which products are vegan?', a: 'PlantFuel (plant protein), Creatine Monohydrate, Ashwagandha KSM-66, Magnesium Glycinate, D3+K2, and HydraForce Electrolytes are fully vegan. Each product page clearly labels dietary information.' },
  { category: 'Products', q: 'Do your products contain banned substances?', a: 'All OMASTRA products are formulated to comply with WADA and NADA prohibited lists. However, if you are a competitive athlete subject to drug testing, please consult the current prohibited list before use. [Demo disclaimer: this is fictional data.]' },
  { category: 'Orders', q: 'Can I modify or cancel my order after placing it?', a: 'Orders in "Pending" or "Confirmed" status can be cancelled from your account. Once an order moves to "Processing" or beyond, cancellation may not be possible. Contact us immediately at support@omastra.in.' },
  { category: 'Orders', q: 'When will I receive my order?', a: 'Standard delivery across India takes 3–5 business days. Metro areas (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune) typically receive orders within 2–3 days.' },
  { category: 'Orders', q: 'Do you offer express delivery?', a: 'Express delivery options are being added to the platform. Currently standard delivery is available. Free shipping applies to all orders above ₹999.' },
  { category: 'Payment', q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD) and online payments via Razorpay (credit/debit cards, UPI, net banking, wallets). COD is available India-wide.' },
  { category: 'Payment', q: 'Is my payment information secure?', a: 'Online payments are processed by Razorpay, a PCI-DSS compliant payment gateway. We never store your card details on our servers.' },
  { category: 'Returns', q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for sealed, unopened products. Once opened, products cannot be returned for hygiene and food safety reasons. See our Shipping & Returns page for complete details.' },
  { category: 'Returns', q: 'What if I received a damaged or wrong product?', a: 'Contact us within 48 hours of delivery with photos of the damaged/incorrect product and your order number. We will arrange a replacement or full refund at no extra cost.' },
]

const CATEGORIES = ['All', ...new Set(FAQS.map(f => f.category))]

export default function FAQPage() {
  const [open, setOpen] = useState(null)
  const [cat, setCat] = useState('All')

  const filtered = cat === 'All' ? FAQS : FAQS.filter(f => f.category === cat)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wide text-black mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500">Answers to the questions we get most often.</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setCat(c); setOpen(null) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c ? 'bg-black text-white font-semibold shadow-md shadow-black/15' : 'border border-gray-200 text-gray-500 hover:border-black'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white transition-colors"
            >
              <span className="font-medium text-black text-sm pr-4">{faq.q}</span>
              <span className={`text-black text-lg transition-transform flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === i && (
              <div className="px-6 pb-5 border-t border-gray-200 pt-3">
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center card p-6">
        <p className="text-black font-semibold mb-2">Still have a question?</p>
        <p className="text-gray-500 text-sm mb-4">Our support team is available Mon–Sat, 9am–6pm IST.</p>
        <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-semibold text-sm rounded-xl hover:bg-black-hover transition-colors shadow-lg shadow-black/15">
          Contact Us
        </a>
      </div>
    </div>
  )
}


