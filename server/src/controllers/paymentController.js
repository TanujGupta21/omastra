const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_placeholder')) {
    throw new AppError(
      'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.',
      503
    );
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);
  if (order.paymentStatus === 'paid') throw new AppError('Order is already paid', 400);

  const razorpay = getRazorpay();
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: { orderId: order._id.toString() },
  });

  order.razorpayOrderId = rpOrder.id;
  await order.save();

  return success(res, {
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    orderNumber: order.orderNumber,
  });
});

exports.verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  // Server-side signature verification — CRITICAL security step
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment verification failed: invalid signature', 400);
  }

  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);
  if (order.paymentStatus === 'paid') throw new AppError('Payment already recorded', 400);

  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paymentStatus = 'paid';
  order.fulfillmentStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment verified' });
  await order.save();

  return success(res, { orderNumber: order.orderNumber }, 'Payment verified successfully');
});
