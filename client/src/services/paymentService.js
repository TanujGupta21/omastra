import api from '../lib/api';

export const paymentService = {
  createRazorpayOrder: (orderId) =>
    api.post('/api/v1/payment/razorpay/create-order', { orderId }),
  verifyRazorpay: (data) =>
    api.post('/api/v1/payment/razorpay/verify', data),
  initiateCOD: (orderId) =>
    api.post('/api/v1/payment/cod', { orderId }),
};

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
