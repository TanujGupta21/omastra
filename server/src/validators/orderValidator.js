/**
 * Order validators.
 */
const { body } = require('express-validator');

exports.createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
  body('items.*.variantId').isMongoId().withMessage('Invalid variant ID'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.line1').notEmpty().withMessage('Address line 1 is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').isIn(['cod', 'online']).withMessage('Payment method must be cod or online'),
];
