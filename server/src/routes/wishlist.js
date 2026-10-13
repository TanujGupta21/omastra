const express = require('express');
const router = express.Router();
const wishlistCtrl = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', wishlistCtrl.getWishlist);
router.post('/', wishlistCtrl.addItem);
router.delete('/:productId', wishlistCtrl.removeItem);

module.exports = router;
