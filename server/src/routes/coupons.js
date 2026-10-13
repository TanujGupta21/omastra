const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/validate', requireAuth, ctrl.validateCoupon);
router.get('/', requireAdmin, ctrl.getCoupons);
router.post('/', requireAdmin, ctrl.createCoupon);
router.put('/:id', requireAdmin, ctrl.updateCoupon);
router.delete('/:id', requireAdmin, ctrl.deleteCoupon);

module.exports = router;
