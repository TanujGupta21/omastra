/**
 * Product validators.
 */
const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid category ID'),
  body('variants').notEmpty().withMessage('At least one variant is required'),
  body('status').optional().isIn(['active', 'draft', 'archived']).withMessage('Invalid status'),
];

exports.updateProductValidator = [
  body('name').optional().trim().notEmpty(),
  body('category').optional().isMongoId().withMessage('Invalid category ID'),
  body('status').optional().isIn(['active', 'draft', 'archived']).withMessage('Invalid status'),
];
