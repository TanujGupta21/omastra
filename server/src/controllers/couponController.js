const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

exports.validateCoupon = catchAsync(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
  if (!coupon) throw new AppError('Invalid coupon code', 400);

  const validity = coupon.isValid(Number(subtotal));
  if (!validity.valid) throw new AppError(validity.reason, 400);

  const discount = Math.round(coupon.calculateDiscount(Number(subtotal)));
  return success(res, {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
    description: coupon.description,
  }, 'Coupon applied');
});

exports.getCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return success(res, coupons);
});

exports.createCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  return success(res, coupon, 'Coupon created', 201);
});

exports.updateCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new AppError('Coupon not found', 404);
  return success(res, coupon, 'Coupon updated');
});

exports.deleteCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  return success(res, null, 'Coupon deleted');
});
