const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.post('/razorpay/create-order', optionalAuth, ctrl.createRazorpayOrder);
router.post('/razorpay/verify', optionalAuth, ctrl.verifyPayment);

module.exports = router;
