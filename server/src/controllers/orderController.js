const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const InventoryLog = require('../models/InventoryLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, paginated } = require('../utils/apiResponse');
const emailService = require('../services/emailService');

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

exports.createOrder = catchAsync(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    guestEmail,
    guestPhone,
  } = req.body;

  if (!items?.length) throw new AppError('Order must have at least one item', 400);

  // === Server-side price & stock verification ===
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    let product = null;
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      product = await Product.findById(item.productId).catch(() => null);
    }
    if (!product && item.productId) {
      product = await Product.findOne({ $or: [{ slug: item.productId }, { _id: item.productId }] }).catch(() => null);
    }

    if (product) {
      const variant = product.variants?.find(
        (v) => String(v._id || v.id || v.sku) === String(item.variantId) || v.sku === item.variantSku
      );
      const unitPrice = variant?.price || item.unitPrice || 0;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productSlug: product.slug,
        variantId: variant?._id || variant?.sku || item.variantId,
        variantSku: variant?.sku || item.variantSku,
        variantFlavor: variant?.flavor || item.variantFlavor,
        variantSize: variant?.size || item.variantSize,
        image: product.images?.[0]?.url || item.image || '',
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    } else {
      const unitPrice = Number(item.unitPrice || item.price || 0);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productName: item.productName || 'OMASTRA Product',
        productSlug: item.productSlug || item.productId,
        variantId: item.variantId,
        variantSku: item.variantSku,
        variantFlavor: item.variantFlavor,
        variantSize: item.variantSize,
        image: item.image || '/products/whey-pro.png',
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }
  }

  // === Coupon validation ===
  let discount = 0;
  let validatedCouponCode = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) throw new AppError('Invalid coupon code', 400);
    const validity = coupon.isValid(subtotal);
    if (!validity.valid) throw new AppError(validity.reason, 400);

    // Per-user limit check
    if (req.user && coupon.perUserLimit) {
      const userOrdersWithCoupon = await Order.countDocuments({
        user: req.user._id,
        couponCode: coupon.code,
        paymentStatus: { $ne: 'failed' },
      });
      if (userOrdersWithCoupon >= coupon.perUserLimit)
        throw new AppError('You have already used this coupon', 400);
    }

    discount = Math.round(coupon.calculateDiscount(subtotal));
    validatedCouponCode = coupon.code;
  }

  const shippingCharge = subtotal - discount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = Math.max(0, subtotal - discount + shippingCharge);

  // === Stock decrement ===
  for (const item of orderItems) {
    if (!item.product) continue;
    const product = await Product.findById(item.product).catch(() => null);
    if (!product) continue;

    let targetVariant = null;
    if (product.variants && Array.isArray(product.variants)) {
      targetVariant = product.variants.find(
        (v) => String(v._id || v.id || v.sku) === String(item.variantId) || v.sku === item.variantSku
      );
    }

    if (targetVariant) {
      targetVariant.stock = Math.max(0, (targetVariant.stock || 0) - item.quantity);
      await product.save().catch(() => {});
    }
  }

  // === Create order ===
  const orderData = {
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    couponCode: validatedCouponCode,
    shippingCharge,
    total,
  };

  if (req.user) orderData.user = req.user._id;
  else {
    orderData.guestEmail = guestEmail;
    orderData.guestPhone = guestPhone;
  }

  const order = await Order.create(orderData);

  // Increment coupon usage
  if (validatedCouponCode) {
    await Coupon.findOneAndUpdate(
      { code: validatedCouponCode },
      { $inc: { usedCount: 1 } }
    );
  }

  // Log inventory movements
  for (const item of orderItems) {
    try {
      await InventoryLog.create({
        product: item.product,
        variantId: item.variantId,
        variantSku: item.variantSku,
        type: 'sale',
        delta: -item.quantity,
        order: order._id,
        performedBy: req.user?._id,
      });
    } catch (e) {
      console.warn('Inventory log warning:', e.message);
    }
  }

  // Clear server cart if user is logged in
  if (req.user) {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  }

  // Send confirmation email (non-blocking)
  emailService.sendOrderConfirmation(order, req.user || { email: guestEmail, name: guestPhone }).catch(
    (e) => console.error('Email error:', e.message)
  );

  return success(res, order, 'Order placed successfully', 201);
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments({ user: req.user._id }),
  ]);

  return paginated(res, orders, total, page, limit);
});

exports.getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  // Customers can only see their own orders
  if (req.user) {
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      throw new AppError('Access denied', 403);
    }
  } else {
    // Guest access: if order belongs to a registered user, require login
    if (order.user) {
      throw new AppError('Please sign in to view this order', 401);
    }
  }

  return success(res, order);
});

exports.cancelOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (req.user.role !== 'admin' && order.user?.toString() !== req.user._id.toString()) {
    throw new AppError('Access denied', 403);
  }

  const cancellableStatuses = ['pending', 'confirmed'];
  if (!cancellableStatuses.includes(order.fulfillmentStatus)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  order.fulfillmentStatus = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by customer' });
  await order.save();

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product && Array.isArray(product.variants)) {
      const targetVariant = product.variants.find(
        (v) => String(v._id || v.id || v.sku) === String(item.variantId) || v.sku === item.variantSku
      );
      if (targetVariant) {
        targetVariant.stock = (targetVariant.stock || 0) + item.quantity;
        await product.save();
      }
    }
  }

  return success(res, order, 'Order cancelled');
});

// Admin only
exports.getAllOrders = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search,
    from,
    to,
  } = req.query;

  const filter = {};
  if (status) filter.fulfillmentStatus = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { guestEmail: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments(filter),
  ]);

  return paginated(res, orders, total, page, limit);
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { fulfillmentStatus, paymentStatus, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  const validFulfillment = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (fulfillmentStatus && !validFulfillment.includes(fulfillmentStatus)) {
    throw new AppError('Invalid fulfillment status', 400);
  }

  if (fulfillmentStatus) {
    order.fulfillmentStatus = fulfillmentStatus;
    order.statusHistory.push({ status: fulfillmentStatus, note });
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (req.body.adminNotes) order.adminNotes = req.body.adminNotes;

  await order.save();
  return success(res, order, 'Order updated');
});

exports.trackOrder = catchAsync(async (req, res) => {
  const { orderNumber, email } = req.query;
  if (!orderNumber) throw new AppError('Order number is required', 400);

  const order = await Order.findOne({ orderNumber: orderNumber.trim().toUpperCase() })
    .populate('user', 'name email')
    .populate('items.product', 'images');

  if (!order) throw new AppError('Order not found. Please verify the order number.', 404);

  if (email) {
    const normEmail = email.trim().toLowerCase();
    const guestMatch = order.guestEmail && order.guestEmail.toLowerCase() === normEmail;
    const userMatch = order.user?.email && order.user.email.toLowerCase() === normEmail;
    if (!guestMatch && !userMatch) {
      throw new AppError('Email does not match the records for this order', 403);
    }
  }

  return success(res, order);
});
