const express = require('express');
const router = express.Router();
const inventoryCtrl = require('../controllers/inventoryController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);

router.post('/adjust', inventoryCtrl.adjustStock);
router.get('/logs', inventoryCtrl.getInventoryLogs);

module.exports = router;
