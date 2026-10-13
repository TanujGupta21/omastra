const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const start = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = to ? new Date(to) : new Date();

  const dateFilter = { createdAt: { $gte: start, $lte: end } };
  const paidFilter = { ...dateFilter, paymentStatus: 'paid' };

  const [
    totalRevenue,
    orderCount,
    customerCount,
    revenueChart,
    bestSellers,
    recentOrders,
    lowStock,
  ] = await Promise.all([
    Order.aggregate([
      { $match: paidFilter },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments(dateFilter),
    User.countDocuments({ role: 'customer', createdAt: dateFilter.createdAt }),
    Order.aggregate([
      { $match: paidFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: paidFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.productName' },
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean(),
    Product.aggregate([
      { $unwind: '$variants' },
      { $match: { 'variants.stock': { $lte: 10 } } },
      {
        $project: {
          name: 1,
          slug: 1,
          variantSku: '$variants.sku',
          variantFlavor: '$variants.flavor',
          variantSize: '$variants.size',
          stock: '$variants.stock',
          threshold: '$variants.lowStockThreshold',
        },
      },
      { $limit: 20 },
    ]),
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

  return success(res, {
    revenue,
    orderCount,
    customerCount,
    avgOrderValue: Math.round(avgOrderValue),
    revenueChart,
    bestSellers,
    recentOrders,
    lowStock,
    dateRange: { from: start, to: end },
  });
});

exports.getCustomers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = { role: 'customer' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [customers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);
  return success(res, { customers, total, page: Number(page), pages: Math.ceil(total / limit) });
});

exports.updateCustomerStatus = catchAsync(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  return success(res, user, 'Customer status updated');
});

exports.getAnalytics = catchAsync(async (req, res) => {
  const { from, to, groupBy = 'day' } = req.query;
  const start = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = to ? new Date(to) : new Date();

  const formatMap = { day: '%Y-%m-%d', week: '%Y-W%V', month: '%Y-%m' };
  const fmt = formatMap[groupBy] || formatMap.day;

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: fmt, date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
        avgOrder: { $avg: '$total' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return success(res, data);
});
