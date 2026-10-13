const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'omastra',
  password: process.env.PG_PASSWORD || '2193',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Helper to convert DB row to document object with _id and id and methods
function normalizeRow(row, tableName) {
  if (!row) return null;
  const doc = { ...row };
  doc._id = row.id;
  
  // Specific mappings for frontend compatibility
  if (tableName === 'users') {
    doc.isActive = row.is_active;
    doc.newsletterSubscribed = row.newsletter_subscribed;
    doc.refreshToken = row.refresh_token;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;

    doc.comparePassword = async function (candidatePassword) {
      if (!doc.password) return false;
      return bcrypt.compare(candidatePassword, doc.password);
    };
  } else if (tableName === 'categories') {
    doc.isActive = row.is_active;
    doc.sortOrder = row.sort_order;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;
  } else if (tableName === 'products') {
    doc.category = row.category_id;
    doc.categoryId = row.category_id;
    doc.shortDescription = row.short_description;
    doc.nutritionFacts = row.nutrition_facts;
    doc.dietaryInfo = row.dietary_info;
    doc.isFeatured = row.is_featured;
    doc.isBestSeller = row.is_bestseller;
    doc.image = doc.images?.find?.((i) => i.isPrimary)?.url || doc.images?.[0]?.url || null;
    doc.averageRating = Number(row.average_rating) || 0;
    doc.reviewCount = Number(row.review_count) || 0;
    doc.countryOfOrigin = row.country_of_origin;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;
    
    // Virtual minPrice and variants normalization
    if (Array.isArray(doc.variants) && doc.variants.length > 0) {
      doc.variants = doc.variants.map((v) => {
        const vid = v._id || v.id || v.sku;
        return {
          ...v,
          _id: vid,
          id: vid,
        };
      });

      doc.variants.id = function (targetId) {
        if (!targetId) return null;
        return this.find((v) => String(v._id) === String(targetId) || String(v.id) === String(targetId) || String(v.sku) === String(targetId)) || null;
      };

      const active = doc.variants.filter((v) => v.isActive !== false && (v.stock || 0) > 0);
      doc.minPrice = active.length > 0 ? Math.min(...active.map((v) => v.price)) : Math.min(...doc.variants.map((v) => v.price));
    } else {
      doc.variants = [];
      doc.variants.id = function () { return null; };
      doc.minPrice = null;
    }

  } else if (tableName === 'orders') {
    doc.orderNumber = row.order_number;
    doc.user = row.user_id;
    doc.userId = row.user_id;
    doc.guestEmail = row.guest_email;
    doc.guestPhone = row.guest_phone;
    doc.shippingAddress = row.shipping_address;
    doc.couponCode = row.coupon_code;
    doc.shippingCharge = Number(row.shipping_charge) || 0;
    doc.subtotal = Number(row.subtotal) || 0;
    doc.discount = Number(row.discount) || 0;
    doc.total = Number(row.total) || 0;
    doc.paymentMethod = row.payment_method;
    doc.paymentStatus = row.payment_status;
    doc.fulfillmentStatus = row.fulfillment_status;
    doc.razorpayOrderId = row.razorpay_order_id;
    doc.razorpayPaymentId = row.razorpay_payment_id;
    doc.razorpaySignature = row.razorpay_signature;
    doc.adminNotes = row.admin_notes;
    doc.statusHistory = row.status_history || [];
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;
  } else if (tableName === 'coupons') {
    doc.minSpend = Number(row.min_spend) || 0;
    doc.maxDiscount = row.max_discount ? Number(row.max_discount) : null;
    doc.usageLimit = row.usage_limit;
    doc.usedCount = row.used_count || 0;
    doc.perUserLimit = row.per_user_limit || 1;
    doc.eligibleUsers = row.eligible_users || [];
    doc.expiresAt = row.expires_at;
    doc.isActive = row.is_active;
    doc.value = Number(row.value) || 0;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;

    doc.isValid = function (orderSubtotal) {
      const now = new Date();
      if (!doc.isActive) return { valid: false, reason: 'Coupon is not active' };
      if (doc.expiresAt && new Date(doc.expiresAt) < now) return { valid: false, reason: 'Coupon has expired' };
      if (doc.usageLimit && doc.usedCount >= doc.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' };
      if (orderSubtotal < doc.minSpend) return { valid: false, reason: `Minimum spend of ₹${doc.minSpend} required` };
      return { valid: true };
    };

    doc.calculateDiscount = function (subtotal) {
      if (doc.type === 'flat') return Math.min(doc.value, subtotal);
      const discount = (subtotal * doc.value) / 100;
      return doc.maxDiscount ? Math.min(discount, doc.maxDiscount) : discount;
    };
  } else if (tableName === 'reviews') {
    doc.product = row.product_id;
    doc.productId = row.product_id;
    doc.user = row.user_id;
    doc.userId = row.user_id;
    doc.order = row.order_id;
    doc.isVerifiedPurchase = row.is_verified_purchase;
    doc.isApproved = row.is_approved;
    doc.adminResponse = row.admin_response;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;
  } else if (tableName === 'carts' || tableName === 'wishlists') {
    doc.user = row.user_id;
    doc.userId = row.user_id;
    doc.items = Array.isArray(row.items) ? row.items : [];
    doc.items = doc.items.map((i) => ({
      _id: i._id || i.id || uuidv4(),
      id: i._id || i.id || uuidv4(),
      ...i,
    }));
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;

  } else if (tableName === 'inventory_logs') {
    doc.product = row.product_id;
    doc.variantSku = row.variant_sku;
    doc.stockBefore = row.stock_before;
    doc.stockAfter = row.stock_after;
    doc.performedBy = row.performed_by;
    doc.order = row.order_id;
    doc.createdAt = row.created_at;
    doc.updatedAt = row.updated_at;
  }

  // Common Mongoose-like doc methods
  doc.save = async function () {
    return createModel(tableName).findByIdAndUpdate(doc.id, doc);
  };
  doc.toObject = function () {
    return { ...doc };
  };
  doc.toJSON = function () {
    const c = { ...doc };
    delete c.password;
    delete c.refreshToken;
    return c;
  };

  return doc;
}

// Convert model document fields to DB row columns
function docToRow(data, tableName) {
  const row = {};
  if (data._id || data.id) row.id = String(data._id || data.id);
  
  if (tableName === 'users') {
    if (data.name !== undefined) row.name = data.name;
    if (data.email !== undefined) row.email = data.email.toLowerCase();
    if (data.password !== undefined) row.password = data.password;
    if (data.phone !== undefined) row.phone = data.phone;
    if (data.role !== undefined) row.role = data.role;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    if (data.addresses !== undefined) row.addresses = JSON.stringify(data.addresses);
    if (data.newsletterSubscribed !== undefined) row.newsletter_subscribed = data.newsletterSubscribed;
    if (data.refreshToken !== undefined) row.refresh_token = data.refreshToken;
  } else if (tableName === 'categories') {
    if (data.name !== undefined) row.name = data.name;
    if (data.slug !== undefined) row.slug = data.slug;
    if (data.description !== undefined) row.description = data.description;
    if (data.image !== undefined) row.image = data.image;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    if (data.sortOrder !== undefined) row.sort_order = data.sortOrder;
  } else if (tableName === 'products') {
    if (data.name !== undefined) row.name = data.name;
    if (data.slug !== undefined) row.slug = data.slug;
    if (data.category !== undefined || data.categoryId !== undefined) {
      row.category_id = String(data.category?._id || data.category || data.categoryId);
    }
    if (data.shortDescription !== undefined) row.short_description = data.shortDescription;
    if (data.description !== undefined) row.description = data.description;
    if (data.images !== undefined) row.images = JSON.stringify(data.images);
    if (data.variants !== undefined) row.variants = JSON.stringify(data.variants);
    if (data.nutritionFacts !== undefined) row.nutrition_facts = JSON.stringify(data.nutritionFacts);
    if (data.ingredients !== undefined) row.ingredients = data.ingredients;
    if (data.allergens !== undefined) row.allergens = data.allergens;
    if (data.directions !== undefined) row.directions = data.directions;
    if (data.storage !== undefined) row.storage = data.storage;
    if (data.dietaryInfo !== undefined) row.dietary_info = JSON.stringify(data.dietaryInfo);
    if (data.tags !== undefined) row.tags = JSON.stringify(data.tags);
    if (data.isFeatured !== undefined) row.is_featured = data.isFeatured;
    if (data.isBestSeller !== undefined) row.is_bestseller = data.isBestSeller;
    if (data.status !== undefined) row.status = data.status;
    if (data.averageRating !== undefined) row.average_rating = data.averageRating;
    if (data.reviewCount !== undefined) row.review_count = data.reviewCount;
    if (data.manufacturer !== undefined) row.manufacturer = data.manufacturer;
    if (data.countryOfOrigin !== undefined) row.country_of_origin = data.countryOfOrigin;
  } else if (tableName === 'orders') {
    if (data.orderNumber !== undefined) row.order_number = data.orderNumber;
    if (data.user !== undefined || data.userId !== undefined) row.user_id = String(data.user?._id || data.user || data.userId || '');
    if (data.guestEmail !== undefined) row.guest_email = data.guestEmail;
    if (data.guestPhone !== undefined) row.guest_phone = data.guestPhone;
    if (data.items !== undefined) row.items = JSON.stringify(data.items);
    if (data.shippingAddress !== undefined) row.shipping_address = JSON.stringify(data.shippingAddress);
    if (data.subtotal !== undefined) row.subtotal = data.subtotal;
    if (data.discount !== undefined) row.discount = data.discount;
    if (data.couponCode !== undefined) row.coupon_code = data.couponCode;
    if (data.shippingCharge !== undefined) row.shipping_charge = data.shippingCharge;
    if (data.total !== undefined) row.total = data.total;
    if (data.paymentMethod !== undefined) row.payment_method = data.paymentMethod;
    if (data.paymentStatus !== undefined) row.payment_status = data.paymentStatus;
    if (data.fulfillmentStatus !== undefined) row.fulfillment_status = data.fulfillmentStatus;
    if (data.razorpayOrderId !== undefined) row.razorpay_order_id = data.razorpayOrderId;
    if (data.razorpayPaymentId !== undefined) row.razorpay_payment_id = data.razorpayPaymentId;
    if (data.razorpaySignature !== undefined) row.razorpay_signature = data.razorpaySignature;
    if (data.notes !== undefined) row.notes = data.notes;
    if (data.adminNotes !== undefined) row.admin_notes = data.adminNotes;
    if (data.statusHistory !== undefined) row.status_history = JSON.stringify(data.statusHistory);
  } else if (tableName === 'carts' || tableName === 'wishlists') {
    if (data.user !== undefined || data.userId !== undefined) row.user_id = String(data.user?._id || data.user || data.userId || '');
    if (data.items !== undefined) row.items = JSON.stringify(data.items);
  } else if (tableName === 'coupons') {
    if (data.code !== undefined) row.code = data.code.toUpperCase();
    if (data.type !== undefined) row.type = data.type;
    if (data.value !== undefined) row.value = data.value;
    if (data.minSpend !== undefined) row.min_spend = data.minSpend;
    if (data.maxDiscount !== undefined) row.max_discount = data.maxDiscount;
    if (data.usageLimit !== undefined) row.usage_limit = data.usageLimit;
    if (data.usedCount !== undefined) row.used_count = data.usedCount;
    if (data.perUserLimit !== undefined) row.per_user_limit = data.perUserLimit;
    if (data.eligibleUsers !== undefined) row.eligible_users = JSON.stringify(data.eligibleUsers);
    if (data.expiresAt !== undefined) row.expires_at = data.expiresAt;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    if (data.description !== undefined) row.description = data.description;
  } else if (tableName === 'reviews') {
    if (data.product !== undefined || data.productId !== undefined) row.product_id = String(data.product?._id || data.product || data.productId);
    if (data.user !== undefined || data.userId !== undefined) row.user_id = String(data.user?._id || data.user || data.userId);
    if (data.order !== undefined || data.orderId !== undefined) row.order_id = String(data.order?._id || data.order || data.orderId || '');
    if (data.rating !== undefined) row.rating = data.rating;
    if (data.title !== undefined) row.title = data.title;
    if (data.body !== undefined) row.body = data.body;
    if (data.isVerifiedPurchase !== undefined) row.is_verified_purchase = data.isVerifiedPurchase;
    if (data.isApproved !== undefined) row.is_approved = data.isApproved;
    if (data.adminResponse !== undefined) row.admin_response = data.adminResponse;
  } else if (tableName === 'inventory_logs') {
    row.product_id = String(data.product?._id || data.product || data.productId || '');
    row.variant_sku = data.variantSku || 'DEFAULT';
    row.type = data.type || 'manual';
    row.delta = data.delta !== undefined ? Number(data.delta) : (data.quantity !== undefined ? Number(data.quantity) : 0);
    row.stock_before = data.stockBefore !== undefined ? Number(data.stockBefore) : 0;
    row.stock_after = data.stockAfter !== undefined ? Number(data.stockAfter) : 0;
    if (data.reference !== undefined) row.reference = data.reference;
    if (data.performedBy) row.performed_by = String(data.performedBy);
    if (data.order) row.order_id = String(data.order);
  }

  return row;
}

// Convert Mongoose-like filter to SQL WHERE clause
function buildWhereClause(filter = {}, tableName) {
  const conditions = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(filter)) {
    if (val === undefined) continue;

    if (key === '_id' || key === 'id') {
      if (typeof val === 'object' && val?.$in) {
        conditions.push(`id = ANY($${idx++})`);
        values.push(val.$in.map(String));
      } else if (typeof val === 'object' && val?.$nin) {
        conditions.push(`NOT (id = ANY($${idx++}))`);
        values.push(val.$nin.map(String));
      } else {
        conditions.push(`id = $${idx++}`);
        values.push(String(val));
      }
    } else if (key === 'slug') {
      conditions.push(`slug = $${idx++}`);
      values.push(val);
    } else if (key === 'email') {
      conditions.push(`LOWER(email) = LOWER($${idx++})`);
      values.push(String(val));
    } else if (key === 'category') {
      if (typeof val === 'object' && val?.$in) {
        conditions.push(`category_id = ANY($${idx++})`);
        values.push(val.$in.map(String));
      } else {
        conditions.push(`category_id = $${idx++}`);
        values.push(String(val?._id || val));
      }
    } else if (key === 'user') {
      conditions.push(`user_id = $${idx++}`);
      values.push(String(val?._id || val));
    } else if (key === 'product') {
      conditions.push(`product_id = $${idx++}`);
      values.push(String(val?._id || val));
    } else if (key === 'status') {
      conditions.push(`status = $${idx++}`);
      values.push(val);
    } else if (key === 'isFeatured') {
      conditions.push(`is_featured = $${idx++}`);
      values.push(Boolean(val));
    } else if (key === 'isBestSeller') {
      conditions.push(`is_bestseller = $${idx++}`);
      values.push(Boolean(val));
    } else if (key === 'isActive') {
      conditions.push(`is_active = $${idx++}`);
      values.push(Boolean(val));
    } else if (key === 'isApproved') {
      conditions.push(`is_approved = $${idx++}`);
      values.push(Boolean(val));
    } else if (key === 'orderNumber') {
      conditions.push(`order_number = $${idx++}`);
      values.push(val);
    } else if (key === 'code') {
      conditions.push(`UPPER(code) = UPPER($${idx++})`);
      values.push(val);
    } else if (key === '$or' && Array.isArray(val)) {
      const orClauses = [];
      for (const item of val) {
        const sub = buildWhereClause(item, tableName);
        if (sub.conditions.length) {
          const reindexed = sub.conditions.map((c) => {
            return c.replace(/\$(\d+)/g, (_, n) => `$${idx + parseInt(n, 10) - 1}`);
          });
          orClauses.push(`(${reindexed.join(' AND ')})`);
          values.push(...sub.values);
          idx += sub.values.length;
        }
      }
      if (orClauses.length) conditions.push(`(${orClauses.join(' OR ')})`);
    } else if (key === '$text' && val?.$search) {
      conditions.push(`(name ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${val.$search}%`);
      idx++;
    } else if (key === 'variants' && val?.$elemMatch) {
      const elem = val.$elemMatch;
      const subConds = ["(v->>'isActive') IS DISTINCT FROM 'false'"];
      if (elem.price?.$gte !== undefined) {
        subConds.push(`(v->>'price')::numeric >= $${idx++}`);
        values.push(Number(elem.price.$gte));
      }
      if (elem.price?.$lte !== undefined) {
        subConds.push(`(v->>'price')::numeric <= $${idx++}`);
        values.push(Number(elem.price.$lte));
      }
      conditions.push(`EXISTS (SELECT 1 FROM jsonb_array_elements(variants) AS v WHERE ${subConds.join(' AND ')})`);
    } else if (key === 'minPrice') {
      conditions.push(`EXISTS (SELECT 1 FROM jsonb_array_elements(variants) AS v WHERE (v->>'isActive') IS DISTINCT FROM 'false' AND (v->>'price')::numeric >= $${idx++})`);
      values.push(Number(val));
    } else if (key === 'maxPrice') {
      conditions.push(`EXISTS (SELECT 1 FROM jsonb_array_elements(variants) AS v WHERE (v->>'isActive') IS DISTINCT FROM 'false' AND (v->>'price')::numeric <= $${idx++})`);
      values.push(Number(val));
    } else if (key === 'dietaryInfo' || key === 'dietary_info') {
      const items = val?.$in || (Array.isArray(val) ? val : [val]);
      conditions.push(`dietary_info ?| $${idx++}`);
      values.push(items.map(String));
    } else if (key === 'averageRating' || key === 'average_rating') {
      if (typeof val === 'object' && val?.$gte !== undefined) {
        conditions.push(`average_rating >= $${idx++}`);
        values.push(Number(val.$gte));
      } else {
        conditions.push(`average_rating >= $${idx++}`);
        values.push(Number(val));
      }
    } else {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (typeof val === 'object' && val !== null) {
        if (val.$gte !== undefined) {
          conditions.push(`${col} >= $${idx++}`);
          values.push(val.$gte);
        }
        if (val.$lte !== undefined) {
          conditions.push(`${col} <= $${idx++}`);
          values.push(val.$lte);
        }
        if (val.$ne !== undefined) {
          conditions.push(`${col} != $${idx++}`);
          values.push(val.$ne);
        }
      } else {
        conditions.push(`${col} = $${idx++}`);
        values.push(val);
      }
    }
  }

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    conditions,
    values,
  };
}

class QueryChain {
  constructor(pool, tableName, filter = {}) {
    this.pool = pool;
    this.tableName = tableName;
    this.filter = filter;
    this._sort = 'created_at DESC';
    this._skip = 0;
    this._limit = null;
    this._populate = [];
    this._select = '*';
    this._isSingle = false;
  }

  sort(s) {
    if (typeof s === 'string') {
      if (s === 'price-asc' || s === 'price_asc') {
        this._sort = `(SELECT MIN((v->>'price')::numeric) FROM jsonb_array_elements(variants) AS v WHERE (v->>'isActive') IS DISTINCT FROM 'false') ASC`;
      } else if (s === 'price-desc' || s === 'price_desc') {
        this._sort = `(SELECT MIN((v->>'price')::numeric) FROM jsonb_array_elements(variants) AS v WHERE (v->>'isActive') IS DISTINCT FROM 'false') DESC`;
      } else if (s === 'rating') {
        this._sort = `average_rating DESC, review_count DESC`;
      } else if (s === 'popular') {
        this._sort = `review_count DESC, average_rating DESC`;
      } else if (s === 'featured') {
        this._sort = `is_featured DESC, created_at DESC`;
      } else if (s === 'newest') {
        this._sort = `created_at DESC`;
      } else {
        const parts = s.split(' ');
        const field = parts[0].replace(/([A-Z])/g, '_$1').toLowerCase();
        const dir = parts[1] === '-1' || parts[0].startsWith('-') ? 'DESC' : 'ASC';
        this._sort = `${field.replace(/^-/, '')} ${dir}`;
      }
    } else if (typeof s === 'object' && s !== null) {
      const entries = Object.entries(s);
      if (entries.length) {
        const [k, v] = entries[0];
        const isDesc = v === -1 || String(v).toLowerCase() === 'desc';
        if (k === 'variants.0.price' || k === 'minPrice' || k === 'price' || k === 'variants.price') {
          this._sort = `(SELECT MIN((v->>'price')::numeric) FROM jsonb_array_elements(variants) AS v WHERE (v->>'isActive') IS DISTINCT FROM 'false') ${isDesc ? 'DESC' : 'ASC'}`;
        } else if (k === 'averageRating' || k === 'average_rating') {
          this._sort = `average_rating ${isDesc ? 'DESC' : 'ASC'}, review_count DESC`;
        } else if (k === 'reviewCount' || k === 'review_count') {
          this._sort = `review_count ${isDesc ? 'DESC' : 'ASC'}, average_rating DESC`;
        } else if (k === 'isFeatured' || k === 'is_featured') {
          this._sort = `is_featured ${isDesc ? 'DESC' : 'ASC'}, created_at DESC`;
        } else {
          const col = k === '_id' ? 'id' : k.replace(/([A-Z])/g, '_$1').toLowerCase();
          this._sort = `${col} ${isDesc ? 'DESC' : 'ASC'}`;
        }
      }
    }
    return this;
  }

  skip(n) {
    this._skip = Math.max(0, parseInt(n, 10) || 0);
    return this;
  }

  limit(n) {
    this._limit = parseInt(n, 10);
    return this;
  }

  populate(field, selectFields) {
    const path = typeof field === 'object' && field !== null ? (field.path || field.field) : field;
    this._populate.push({ field: path, selectFields });
    return this;
  }

  lean() {
    return this;
  }

  select(fields) {
    return this;
  }

  async exec() {
    const { where, values } = buildWhereClause(this.filter, this.tableName);
    let sql = `SELECT ${this._select} FROM ${this.tableName} ${where}`;
    if (this._sort) sql += ` ORDER BY ${this._sort}`;
    if (this._limit) sql += ` LIMIT ${this._limit}`;
    if (this._skip) sql += ` OFFSET ${this._skip}`;

    const res = await this.pool.query(sql, values);
    let rows = res.rows.map((r) => normalizeRow(r, this.tableName));

    // Handle populate for product category
    if (this.tableName === 'products' && this._populate.some((p) => p.field === 'category')) {
      const catIds = [...new Set(rows.map((r) => r.category).filter(Boolean))];
      if (catIds.length) {
        const catRes = await this.pool.query('SELECT * FROM categories WHERE id = ANY($1)', [catIds]);
        const catMap = Object.fromEntries(catRes.rows.map((c) => [c.id, normalizeRow(c, 'categories')]));
        rows = rows.map((r) => ({
          ...r,
          category: catMap[r.category] || null,
        }));
      }
    }

    // Handle populate for cart items.product
    if (this.tableName === 'carts') {
      for (const row of rows) {
        if (Array.isArray(row.items) && row.items.length > 0) {
          const prodIds = row.items
            .map((i) => (typeof i.product === 'object' && i.product !== null ? (i.product._id || i.product.id) : i.product))
            .filter(Boolean);
          if (prodIds.length > 0) {
            const prodRes = await this.pool.query('SELECT * FROM products WHERE id = ANY($1)', [prodIds]);
            const prodMap = Object.fromEntries(prodRes.rows.map((p) => [p.id, normalizeRow(p, 'products')]));
            for (const item of row.items) {
              const pid = typeof item.product === 'object' && item.product !== null ? (item.product._id || item.product.id) : item.product;
              if (prodMap[pid]) {
                item.product = prodMap[pid];
              }
            }
          }
        }
      }
    }


    if (this._isSingle) {
      return rows[0] || null;
    }
    return rows;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

function createModel(tableName) {
  return {
    tableName,
    find(filter = {}) {
      return new QueryChain(pool, tableName, filter);
    },

    findOne(filter = {}) {
      const chain = new QueryChain(pool, tableName, filter).limit(1);
      chain._isSingle = true;
      return chain;
    },

    findById(id) {
      if (!id) {
        const chain = new QueryChain(pool, tableName, { id: '__none__' }).limit(1);
        chain._isSingle = true;
        return chain;
      }
      return this.findOne({ _id: String(id) });
    },

    async create(docData) {
      const id = docData._id ? String(docData._id) : (docData.id ? String(docData.id) : uuidv4());
      if (tableName === 'users' && docData.password && !docData.password.startsWith('$2')) {
        docData.password = await bcrypt.hash(docData.password, 12);
      }
      if (tableName === 'orders' && !docData.orderNumber) {
        const count = await this.countDocuments();
        docData.orderNumber = `OMA-${String(count + 1).padStart(6, '0')}`;
      }

      const row = docToRow({ ...docData, id }, tableName);
      row.id = id;
      row.created_at = new Date();
      row.updated_at = new Date();

      const keys = Object.keys(row);
      const cols = keys.join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(row);

      const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders}) RETURNING *`;
      const res = await pool.query(sql, values);
      return normalizeRow(res.rows[0], tableName);
    },

    async insertMany(docs = []) {
      const results = [];
      for (const d of docs) {
        results.push(await this.create(d));
      }
      return results;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      if (!id) return null;
      const targetId = String(id);
      
      const existing = await this.findById(targetId);
      if (!existing && !options.upsert) return null;

      let merged = { ...(existing || {}), ...update };
      if (update.$set) merged = { ...merged, ...update.$set };
      if (update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) {
          merged[k] = (Number(merged[k]) || 0) + v;
        }
      }

      const row = docToRow(merged, tableName);
      delete row.id;
      row.updated_at = new Date();

      const keys = Object.keys(row);
      const setClauses = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
      const values = [targetId, ...Object.values(row)];

      const sql = `UPDATE ${tableName} SET ${setClauses} WHERE id = $1 RETURNING *`;
      const res = await pool.query(sql, values);
      return normalizeRow(res.rows[0], tableName);
    },

    async findOneAndUpdate(filter, update, options = {}) {
      const doc = await this.findOne(filter);
      if (!doc) {
        if (options.upsert) return this.create({ ...filter, ...update });
        return null;
      }
      return this.findByIdAndUpdate(doc.id, update, options);
    },

    async findByIdAndDelete(id) {
      if (!id) return null;
      const res = await pool.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [String(id)]);
      return normalizeRow(res.rows[0], tableName);
    },

    async findOneAndDelete(filter) {
      const doc = await this.findOne(filter);
      if (!doc) return null;
      return this.findByIdAndDelete(doc.id);
    },

    async deleteMany(filter = {}) {
      const { where, values } = buildWhereClause(filter, tableName);
      const sql = `DELETE FROM ${tableName} ${where}`;
      const res = await pool.query(sql, values);
      return { deletedCount: res.rowCount };
    },

    async countDocuments(filter = {}) {
      const { where, values } = buildWhereClause(filter, tableName);
      const sql = `SELECT COUNT(*) AS total FROM ${tableName} ${where}`;
      const res = await pool.query(sql, values);
      return parseInt(res.rows[0]?.total || '0', 10);
    },

    async distinct(field, filter = {}) {
      const { where, values } = buildWhereClause(filter, tableName);
      const col = field.replace(/([A-Z])/g, '_$1').toLowerCase();
      const sql = `SELECT DISTINCT ${col} FROM ${tableName} ${where}`;
      const res = await pool.query(sql, values);
      return res.rows.map((r) => r[col]);
    },

    async aggregate(pipeline = []) {
      // Basic aggregate support for dashboard statistics
      if (tableName === 'orders') {
        const res = await pool.query(`
          SELECT 
            COALESCE(SUM(total), 0) AS total_revenue,
            COUNT(*) AS total_orders
          FROM orders
        `);
        return [{
          _id: null,
          totalRevenue: Number(res.rows[0]?.total_revenue || 0),
          totalOrders: Number(res.rows[0]?.total_orders || 0),
        }];
      }
      if (tableName === 'products') {
        const res = await pool.query(`
          SELECT 
            category_id AS _id,
            COUNT(*) AS count
          FROM products
          GROUP BY category_id
        `);
        return res.rows.map((r) => ({ _id: r._id, count: parseInt(r.count, 10) }));
      }
      return [];
    },
  };
}

module.exports = {
  pool,
  createModel,
  User: createModel('users'),
  Category: createModel('categories'),
  Product: createModel('products'),
  Order: createModel('orders'),
  Cart: createModel('carts'),
  Wishlist: createModel('wishlists'),
  Coupon: createModel('coupons'),
  Review: createModel('reviews'),
  InventoryLog: createModel('inventory_logs'),
};
