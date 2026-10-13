export default function ShippingPage() {
  const Section = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b border-gray-200">{title}</h2>
      <div className="text-gray-500 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-black text-black mb-2">Shipping & Returns</h1>
      <p className="text-gray-500 mb-10">Last updated: October 2026</p>

      <Section title="Shipping Policy">
        <p><strong className="text-black">Free Shipping</strong> on all orders above ₹999 across India.</p>
        <p><strong className="text-black">Standard Shipping:</strong> ₹99 flat fee for orders below ₹999.</p>
        <p><strong className="text-black">Delivery Time:</strong> 3–5 business days across India. Metro cities typically receive orders within 2–3 days.</p>
        <p>Orders are processed and dispatched within 1–2 business days of payment confirmation. You will receive a tracking number via email once dispatched.</p>
        <p>We currently deliver across India. International shipping is not available at this time.</p>
      </Section>

      <Section title="Return Policy">
        <p><strong className="text-black">7-Day Return Window:</strong> Returns are accepted within 7 calendar days of delivery.</p>
        <p><strong className="text-black">Condition:</strong> Products must be sealed and unopened. For hygiene and food safety reasons, opened or used products cannot be returned.</p>
        <p><strong className="text-black">Damaged / Wrong Products:</strong> If you received a damaged, defective, or incorrect product, contact us within 48 hours of delivery with photos and your order number. We will arrange a full replacement or refund at no extra cost.</p>
        <p>To initiate a return, email <a href="mailto:support@omastra.in" className="text-black hover:underline">support@omastra.in</a> with your order number and reason.</p>
      </Section>

      <Section title="Refunds">
        <p>Approved refunds are processed within 5–7 business days to the original payment method.</p>
        <p>COD refunds will be issued as bank transfers. Please provide your bank details when contacting support.</p>
      </Section>

      <Section title="Cancellations">
        <p>Orders can be cancelled from your account dashboard while in "Pending" or "Confirmed" status. Once processing has begun, cancellation may not be possible.</p>
        <p>For urgent cancellations, contact us at <a href="mailto:support@omastra.in" className="text-black hover:underline">support@omastra.in</a> immediately.</p>
      </Section>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
        <strong>Demo Notice:</strong> OMASTRA is a demonstration platform. This policy is for illustrative purposes and applies to a fictional store.
      </div>
    </div>
  )
}


