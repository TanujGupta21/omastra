const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../utils/apiResponse');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return error(res, 'Authentication required', 401);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user || !user.isActive) return error(res, 'User not found or inactive', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Session expired, please login again', 401);
    return error(res, 'Invalid authentication token', 401);
  }
};

const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return error(res, 'Admin access required', 403);
    }
    next();
  });
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.isActive) req.user = user;
    }
  } catch {
    // silently ignore — optional auth
  }
  next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth };
