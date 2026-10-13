/**
 * Wishlist Controller
 * All routes require authentication.
 */
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

/**
 * GET /api/v1/wishlist
 */
exports.getWishlist = catchAsync(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name slug images variants averageRating status category',
  });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }
  return success(res, wishlist);
});

/**
 * POST /api/v1/wishlist
 * Body: { productId }
 */
exports.addItem = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') {
    throw new AppError('Product not found', 404);
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, items: [] });
  }

  const alreadyIn = wishlist.items.some(
    (i) => i.product.toString() === productId
  );
  if (!alreadyIn) {
    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  wishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'items.product',
    select: 'name slug images variants averageRating status category',
  });
  return success(res, wishlist, 'Added to wishlist');
});

/**
 * DELETE /api/v1/wishlist/:productId
 */
exports.removeItem = catchAsync(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  wishlist.items = wishlist.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );
  await wishlist.save();

  wishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'items.product',
    select: 'name slug images variants averageRating status category',
  });
  return success(res, wishlist, 'Removed from wishlist');
});
