const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, error } = require('../utils/apiResponse');

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh',
  });
};

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({ name, email, password, phone });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);
  return success(res, user, 'Registration successful', 201);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Your account has been disabled', 403);

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);
  return success(res, user, 'Login successful');
});

exports.logout = catchAsync(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
  return success(res, null, 'Logged out successfully');
});

exports.getMe = catchAsync(async (req, res) => {
  return success(res, req.user, 'User fetched');
});

exports.refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError('Refresh token missing', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401);

  const newAccessToken = signAccessToken(user._id);
  const newRefreshToken = signRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, newAccessToken, newRefreshToken);
  return success(res, null, 'Token refreshed');
});
