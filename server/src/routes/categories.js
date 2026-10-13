const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', ctrl.getCategories);
router.get('/:slug', ctrl.getCategory);
router.post('/', requireAdmin, ctrl.createCategory);
router.put('/:id', requireAdmin, ctrl.updateCategory);
router.delete('/:id', requireAdmin, ctrl.deleteCategory);

module.exports = router;
