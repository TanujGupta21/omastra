const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.put('/password', ctrl.changePassword);
router.get('/addresses', ctrl.getAddresses);
router.post('/addresses', ctrl.addAddress);
router.put('/addresses/:addressId', ctrl.updateAddress);
router.delete('/addresses/:addressId', ctrl.deleteAddress);
router.get('/wishlist', ctrl.getWishlist);
router.post('/wishlist', ctrl.toggleWishlist);

module.exports = router;
