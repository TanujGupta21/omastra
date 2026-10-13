const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', ctrl.getCart);
router.post('/', ctrl.addItem);
router.post('/items', ctrl.addItem);
router.put('/items/:productId', ctrl.updateItem);
router.put('/:itemId', ctrl.updateItem);
router.delete('/items/:productId', ctrl.removeItem);
router.delete('/:itemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);
router.post('/merge', ctrl.mergeGuestCart);

module.exports = router;
