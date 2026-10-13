const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

exports.getProfile = catchAsync(async (req, res) => {
  return success(res, req.user);
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );
  return success(res, user, 'Profile updated');
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
  return success(res, null, 'Password changed successfully');
});

exports.getAddresses = catchAsync(async (req, res) => {
  return success(res, req.user.addresses);
});

exports.addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  return success(res, user.addresses, 'Address added', 201);
});

exports.updateAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new AppError('Address not found', 404);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  Object.assign(address, req.body);
  await user.save();
  return success(res, user.addresses, 'Address updated');
});

exports.deleteAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new AppError('Address not found', 404);
  address.deleteOne();
  await user.save();
  return success(res, user.addresses, 'Address removed');
});

// Wishlist
exports.getWishlist = catchAsync(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'items',
    select: 'name slug images variants averageRating status category',
    populate: { path: 'category', select: 'name slug' },
  });
  return success(res, wishlist?.items || []);
});

exports.toggleWishlist = catchAsync(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

  const idx = wishlist.items.indexOf(productId);
  let added = false;
  if (idx > -1) {
    wishlist.items.splice(idx, 1);
  } else {
    wishlist.items.push(productId);
    added = true;
  }
  await wishlist.save();
  return success(res, { added }, added ? 'Added to wishlist' : 'Removed from wishlist');
});
