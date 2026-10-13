const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/product/:slug', ctrl.getProductReviews);
router.post('/product/:slug', requireAuth, ctrl.createReview);
router.post('/', requireAuth, ctrl.createReview);
router.get('/', (req, res, next) => {
  if (req.query.product) return ctrl.getProductReviews(req, res, next);
  return requireAdmin(req, res, () => ctrl.getAllReviews(req, res, next));
});
router.patch('/:id/moderate', requireAdmin, ctrl.moderateReview);
router.delete('/:id', requireAdmin, ctrl.deleteReview);

module.exports = router;
