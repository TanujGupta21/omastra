const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

exports.getCategories = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.active !== 'false') filter.isActive = true;
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  return success(res, categories);
});

exports.getCategory = catchAsync(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new AppError('Category not found', 404);
  return success(res, category);
});

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  return success(res, category, 'Category created', 201);
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError('Category not found', 404);
  return success(res, category, 'Category updated');
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!category) throw new AppError('Category not found', 404);
  return success(res, null, 'Category deactivated');
});
