const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

const populateCart = (cart) =>
  Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name slug images variants category status',
    populate: { path: 'category', select: 'name slug' },
  });

exports.getCart = catchAsync(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name slug images variants status',
  });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  return success(res, cart);
});

exports.addItem = catchAsync(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') throw new AppError('Product not available', 404);

  const variant = product.variants.id(variantId);
  if (!variant || !variant.isActive) throw new AppError('Variant not available', 404);
  if (variant.stock < quantity) throw new AppError(`Only ${variant.stock} units available`, 400);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingIdx = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.variantId.toString() === variantId
  );

  if (existingIdx > -1) {
    const newQty = cart.items[existingIdx].quantity + quantity;
    if (newQty > variant.stock) throw new AppError(`Only ${variant.stock} units available`, 400);
    cart.items[existingIdx].quantity = newQty;
  } else {
    cart.items.push({ product: productId, variantId, quantity });
  }

  await cart.save();
  const populated = await populateCart(cart);
  return success(res, populated, 'Added to cart');
});

exports.updateItem = catchAsync(async (req, res) => {
  const { variantId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);

  const targetId = req.params.itemId || req.params.productId;
  const item = cart.items.find(
    (i) =>
      i._id.toString() === targetId ||
      (i.product.toString() === targetId && (!variantId || i.variantId.toString() === variantId))
  );
  if (!item) throw new AppError('Item not in cart', 404);

  const product = await Product.findById(item.product);
  const variant = product?.variants.id(item.variantId);
  if (!variant) throw new AppError('Variant not found', 404);
  if (quantity > variant.stock) throw new AppError(`Only ${variant.stock} units available`, 400);

  item.quantity = quantity;
  await cart.save();
  const populated = await populateCart(cart);
  return success(res, populated, 'Cart updated');
});

exports.removeItem = catchAsync(async (req, res) => {
  const { variantId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);

  const targetId = req.params.itemId || req.params.productId;
  cart.items = cart.items.filter(
    (i) =>
      !(
        i._id.toString() === targetId ||
        (i.product.toString() === targetId && (!variantId || i.variantId.toString() === variantId))
      )
  );
  await cart.save();
  const populated = await populateCart(cart);
  return success(res, populated, 'Item removed');
});

exports.clearCart = catchAsync(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  return success(res, null, 'Cart cleared');
});

exports.mergeGuestCart = catchAsync(async (req, res) => {
  const { items } = req.body; // [{productId, variantId, quantity}]
  if (!items?.length) return success(res, null, 'No items to merge');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  for (const guestItem of items) {
    const product = await Product.findById(guestItem.productId);
    if (!product || product.status !== 'active') continue;
    const variant = product.variants.id(guestItem.variantId);
    if (!variant || !variant.isActive) continue;

    const existingIdx = cart.items.findIndex(
      (i) =>
        i.product.toString() === guestItem.productId &&
        i.variantId.toString() === guestItem.variantId
    );

    if (existingIdx > -1) {
      const newQty = cart.items[existingIdx].quantity + guestItem.quantity;
      cart.items[existingIdx].quantity = Math.min(newQty, variant.stock);
    } else {
      cart.items.push({
        product: guestItem.productId,
        variantId: guestItem.variantId,
        quantity: Math.min(guestItem.quantity, variant.stock),
      });
    }
  }

  await cart.save();
  const populated = await populateCart(cart);
  return success(res, populated, 'Cart merged');
});
