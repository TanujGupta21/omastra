const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);
router.get('/dashboard', ctrl.getDashboardStats);
router.get('/customers', ctrl.getCustomers);
router.patch('/customers/:id/status', ctrl.updateCustomerStatus);
router.get('/analytics', ctrl.getAnalytics);

module.exports = router;
