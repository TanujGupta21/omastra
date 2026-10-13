const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'omastra',
  password: process.env.PG_PASSWORD || '2193',
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

const schemaSql = `
-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  addresses JSONB DEFAULT '[]'::jsonb,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  refresh_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  nutrition_facts JSONB DEFAULT '{}'::jsonb,
  ingredients TEXT,
  allergens TEXT,
  directions TEXT,
  storage TEXT,
  dietary_info JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  average_rating NUMERIC DEFAULT 0,
  review_count INT DEFAULT 0,
  manufacturer VARCHAR(255),
  country_of_origin VARCHAR(100) DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  user_id TEXT,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  coupon_code VARCHAR(100),
  shipping_charge NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  notes TEXT,
  admin_notes TEXT,
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARTS
CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  usage_limit INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  eligible_users JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  order_id TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  body TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY LOGS
CREATE TABLE IF NOT EXISTS inventory_logs (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  variant_sku VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'manual',
  delta INT NOT NULL,
  stock_before INT NOT NULL,
  stock_after INT NOT NULL,
  reference TEXT,
  performed_by TEXT,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
`;

async function initPostgres() {
  try {
    console.log('Connecting to PostgreSQL "omastra" database...');
    const client = await pool.connect();
    console.log('Running DDL migrations...');
    await client.query(schemaSql);
    client.release();
    console.log('✅ PostgreSQL tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize PostgreSQL tables:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  initPostgres();
}

module.exports = { pool, initPostgres };
