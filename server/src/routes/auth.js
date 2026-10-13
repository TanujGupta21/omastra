const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  register, login, logout, getMe, refreshToken
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  login
);

router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
