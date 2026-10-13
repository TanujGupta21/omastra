/**
 * Inventory Controller
 * Admin-only stock adjustment with full audit logging.
 */
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const catchAsync = require('../utils/catchAsync');
const { success, error } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

/**
 * POST /api/v1/inventory/adjust
 * Body: { productId, variantSku, adjustment, reason, note }
 * adjustment: positive to add stock, negative to reduce
 */
exports.adjustStock = catchAsync(async (req, res) => {
  const { productId, variantSku, adjustment, reason = 'manual', note } = req.body;

  const delta = Number(adjustment);
  if (!productId) throw new AppError('productId is required', 400);
  if (!variantSku) throw new AppError('variantSku is required', 400);
  if (!delta || delta === 0) throw new AppError('adjustment must be a non-zero number', 400);

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) throw new AppError(`Variant with SKU "${variantSku}" not found`, 404);

  const stockBefore = variant.stock;
  if (stockBefore + delta < 0) {
    throw new AppError(`Cannot reduce stock below 0. Current stock: ${stockBefore}`, 400);
  }

  variant.stock = stockBefore + delta;
  await product.save();

  await InventoryLog.create({
    product: productId,
    variantSku,
    type: reason,
    delta,
    stockBefore,
    stockAfter: variant.stock,
    reference: note,
    performedBy: req.user._id,
  });

  return success(res, {
    sku: variantSku,
    stockBefore,
    stockAfter: variant.stock,
    delta,
  }, 'Stock adjusted');
});

/**
 * GET /api/v1/inventory/logs
 * Query: productId?, type?, page?, limit?
 */
exports.getInventoryLogs = catchAsync(async (req, res) => {
  const { productId, type, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (productId) filter.product = productId;
  if (type) filter.type = type;

  const [logs, total] = await Promise.all([
    InventoryLog.find(filter)
      .populate('product', 'name slug')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    InventoryLog.countDocuments(filter),
  ]);

  return success(res, {
    logs,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  }, 'Inventory logs fetched');
});
