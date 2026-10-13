export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-gray-500 text-sm leading-relaxed">
      <h1 className="text-4xl font-black text-black mb-2">Terms of Service</h1>
      <p className="mb-10">Last updated: October 2026</p>
      {[
        { title: '1. Acceptance of Terms', body: 'By accessing or using the OMASTRA website and placing orders, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
        { title: '2. Products and Pricing', body: 'All products are subject to availability. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to change prices without notice. Final prices are confirmed at checkout.' },
        { title: '3. Orders', body: 'Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Order confirmation is sent by email. We are not responsible for errors in your order after placement.' },
        { title: '4. Health Disclaimer', body: 'Our products are dietary supplements, not medicines. They are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before starting any supplement regimen, especially if you have a medical condition or are taking medication.' },
        { title: '5. Age Requirement', body: 'You must be at least 18 years old to create an account and purchase from OMASTRA.' },
        { title: '6. Intellectual Property', body: 'All content on this site — including logos, product descriptions, images, and copy — is the property of OMASTRA or its licensors and may not be reproduced without written permission.' },
        { title: '7. Limitation of Liability', body: 'OMASTRA\'s liability for any claim arising from use of our products or website is limited to the purchase price of the product in question. We are not liable for indirect, incidental, or consequential damages.' },
        { title: '8. Governing Law', body: 'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in [City], India.' },
        { title: '9. Changes to Terms', body: 'We may update these Terms at any time. Continued use of the site after changes constitutes acceptance of the new Terms.' },
      ].map(({ title, body }) => (
        <div key={title} className="mb-7">
          <h2 className="text-lg font-bold text-black mb-2">{title}</h2>
          <p>{body}</p>
        </div>
      ))}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400 mt-8">
        Demo Notice: This is a fictional Terms of Service for a demonstration platform.
      </div>
    </div>
  )
}


