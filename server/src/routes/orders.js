const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

// Public Tracking
router.get('/track', ctrl.trackOrder);

// Customer
router.post('/', optionalAuth, ctrl.createOrder);
router.get('/my', requireAuth, ctrl.getMyOrders);
router.get('/my/:id', requireAuth, ctrl.getOrderById);
router.patch('/my/:id/cancel', requireAuth, ctrl.cancelOrder);
router.patch('/:id/cancel', requireAuth, ctrl.cancelOrder);

// Admin & Order Lookup
router.get('/', requireAdmin, ctrl.getAllOrders);
router.get('/:id', optionalAuth, ctrl.getOrderById);
router.patch('/:id/status', requireAdmin, ctrl.updateOrderStatus);

module.exports = router;
