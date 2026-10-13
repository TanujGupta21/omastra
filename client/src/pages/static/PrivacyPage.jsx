export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose-sm text-gray-500 leading-relaxed">
      <h1 className="text-4xl font-black text-black mb-2">Privacy Policy</h1>
      <p className="mb-10">Last updated: October 2026</p>
      {[
        { title: 'Information We Collect', body: 'We collect information you provide directly: name, email address, phone number, and delivery addresses when you register or place an order. We also collect usage data such as pages visited, browser type, and IP address to improve our service.' },
        { title: 'How We Use Your Information', body: 'Your information is used to process orders, send order confirmations and shipping updates, provide customer support, improve our products and website, and send promotional communications (only with your consent).' },
        { title: 'Sharing of Information', body: 'We do not sell, trade, or rent your personal information to third parties. We share data with trusted service providers (payment processors, logistics partners, email service providers) strictly to fulfil your orders. These partners are contractually bound to protect your data.' },
        { title: 'Payment Data', body: 'We do not store credit card or bank account information. All payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway. Please review Razorpay\'s privacy policy for details.' },
        { title: 'Cookies', body: 'We use essential cookies to maintain your session and cart state. We may use analytics cookies to understand site usage. You can disable non-essential cookies in your browser settings.' },
        { title: 'Data Retention', body: 'We retain your account data for as long as your account is active. Order data is retained for 7 years for legal and accounting purposes. You may request deletion of your personal data at any time.' },
        { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at support@omastra.in. We will respond within 30 days.' },
        { title: 'Contact', body: 'For privacy-related questions, contact our data controller at support@omastra.in.' },
      ].map(({ title, body }) => (
        <div key={title} className="mb-7">
          <h2 className="text-lg font-bold text-black mb-2">{title}</h2>
          <p className="text-sm">{body}</p>
        </div>
      ))}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400 mt-8">
        Demo Notice: This is a fictional privacy policy for a demonstration platform.
      </div>
    </div>
  )
}


