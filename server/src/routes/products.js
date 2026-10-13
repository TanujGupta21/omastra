const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, ctrl.getProducts);
router.get('/featured', ctrl.getFeatured);
router.get('/best-sellers', ctrl.getBestSellers);
router.get('/slug/:slug', ctrl.getProduct);
router.get('/slug/:slug/related', ctrl.getRelated);
router.get('/:id', ctrl.getProductById);

// Admin only
router.post('/', requireAdmin, ctrl.createProduct);
router.put('/:id', requireAdmin, ctrl.updateProduct);
router.delete('/:id', requireAdmin, ctrl.deleteProduct);
router.patch('/:id/stock', requireAdmin, ctrl.updateVariantStock);

module.exports = router;
