require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging (exclude in test)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

app.use('/api', generalLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OMASTRA API is running', env: process.env.NODE_ENV });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/cart', require('./routes/cart'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/coupons', require('./routes/coupons'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/wishlist', require('./routes/wishlist'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/payment', require('./routes/payments'));
app.use('/api/v1/inventory', require('./routes/inventory'));
app.use('/api/v1/admin', require('./routes/admin'));

// Newsletter subscription (simple endpoint)
app.post('/api/v1/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }
  // In production: save to DB or send to email marketing service
  console.log('[Newsletter] Subscription:', email);
  res.json({ success: true, message: 'You\'re subscribed! Thank you.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
