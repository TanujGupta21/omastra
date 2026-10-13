const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, paginated } = require('../utils/apiResponse');

const recalcProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = result[0]?.avg || 0;
  const count = result[0]?.count || 0;
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
};

exports.getProductReviews = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const target = req.params.slug || req.query.product;
  if (!target) throw new AppError('Product identifier is required', 400);

  const product = await Product.findOne({
    $or: [
      { slug: target },
      ...(target.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: target }] : []),
    ],
  });
  if (!product) throw new AppError('Product not found', 404);

  const filter = { product: product._id, isApproved: true };
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Review.countDocuments(filter),
  ]);

  return paginated(res, reviews, total, page, limit);
});

exports.createReview = catchAsync(async (req, res) => {
  const target = req.params.slug || req.body.productSlug || req.body.product;
  const { rating, title, body, orderId } = req.body;

  let product = null;
  if (target) {
    product = await Product.findOne({
      $or: [
        { slug: target },
        ...(target.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: target }] : []),
      ],
    });
  }
  if (!product) throw new AppError('Product not found', 404);

  // Verify purchase if orderId provided
  let isVerifiedPurchase = false;
  if (orderId) {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      'items.product': product._id,
      paymentStatus: 'paid',
    });
    isVerifiedPurchase = !!order;
  }

  const review = await Review.create({
    product: product._id,
    user: req.user._id,
    order: orderId,
    rating,
    title,
    body,
    isVerifiedPurchase,
    isApproved: false, // requires moderation
  });

  return success(res, review, 'Review submitted and pending approval', 201);
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, approved } = req.query;
  const filter = {};
  if (approved === 'true') filter.isApproved = true;
  if (approved === 'false') filter.isApproved = false;

  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Review.countDocuments(filter),
  ]);
  return paginated(res, reviews, total, page, limit);
});

exports.moderateReview = catchAsync(async (req, res) => {
  const { isApproved, adminResponse } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved, adminResponse },
    { new: true }
  );
  if (!review) throw new AppError('Review not found', 404);

  await recalcProductRating(review.product);
  return success(res, review, 'Review moderated');
});

exports.deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  await recalcProductRating(review.product);
  return success(res, null, 'Review deleted');
});
