const Product = require('../models/Product');
const Category = require('../models/Category');
const InventoryLog = require('../models/InventoryLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, error, paginated } = require('../utils/apiResponse');
const slugify = require('slugify');

exports.getProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sort = 'featured',
    minPrice,
    maxPrice,
    dietary,
    minRating,
    status = 'active',
    featured,
    bestSeller,
  } = req.query;

  const filter = {};
  if (req.user?.role !== 'admin') filter.status = 'active';
  else if (status !== 'all') filter.status = status;

  if (category) {
    const cat = await Category.findOne({ $or: [{ slug: category }, { id: category }, { _id: category }] });
    if (cat) {
      filter.category = cat._id || cat.id;
    } else {
      filter.category = '00000000-0000-0000-0000-000000000000';
    }
  }

  if (featured === 'true') filter.isFeatured = true;
  if (bestSeller === 'true') filter.isBestSeller = true;

  if (search) {
    filter.$text = { $search: search };
  }

  if (dietary) {
    filter.dietaryInfo = { $in: dietary.split(',') };
  }

  if (minRating) {
    filter.averageRating = { $gte: Number(minRating) };
  }

  // Price filter on variants
  if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
    filter.variants = {
      $elemMatch: {
        isActive: true,
        price: {
          ...(minPrice !== undefined && minPrice !== '' ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice !== undefined && maxPrice !== '' ? { $lte: Number(maxPrice) } : {}),
        },
      },
    };
  }

  const sortMap = {
    featured: { isFeatured: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    'price-asc': { minPrice: 1 },
    'price-desc': { minPrice: -1 },
    rating: { averageRating: -1 },
    popular: { reviewCount: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.featured;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);

  return paginated(res, products, total, page, limit);
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return success(res, product);
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return success(res, product);
});

exports.createProduct = catchAsync(async (req, res) => {
  const data = req.body;
  if (!data.slug) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }
  const product = await Product.create(data);
  return success(res, product, 'Product created', 201);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return success(res, product, 'Product updated');
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: 'archived' },
    { new: true }
  );
  if (!product) throw new AppError('Product not found', 404);
  return success(res, null, 'Product archived');
});

exports.getFeatured = catchAsync(async (req, res) => {
  const products = await Product.find({ status: 'active', isFeatured: true })
    .populate('category', 'name slug')
    .limit(8)
    .lean();
  return success(res, products);
});

exports.getBestSellers = catchAsync(async (req, res) => {
  const products = await Product.find({ status: 'active', isBestSeller: true })
    .populate('category', 'name slug')
    .limit(8)
    .lean();
  return success(res, products);
});

exports.getRelated = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new AppError('Product not found', 404);
  const related = await Product.find({
    category: product.category,
    status: 'active',
    _id: { $ne: product._id },
  })
    .populate('category', 'name slug')
    .limit(4)
    .lean();
  return success(res, related);
});

exports.updateVariantStock = catchAsync(async (req, res) => {
  const { variantId, quantity, type, note } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const variant = product.variants.id(variantId);
  if (!variant) throw new AppError('Variant not found', 404);

  variant.stock += quantity;
  if (variant.stock < 0) throw new AppError('Stock cannot go below zero', 400);
  await product.save();

  await InventoryLog.create({
    product: product._id,
    variantId,
    variantSku: variant.sku,
    type: type || 'adjustment',
    quantity,
    note,
    performedBy: req.user._id,
  });

  return success(res, variant, 'Stock updated');
});
