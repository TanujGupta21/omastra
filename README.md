# OMASTRA — Sports Nutrition E-Commerce Platform

> **POWER WITHIN.** — Everyday nutrition. Built for your next level.

A modern, full-stack Indian sports-nutrition e-commerce platform built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running in Development](#running-in-development)
- [Seeding Demo Data](#seeding-demo-data)
- [Payment Testing](#payment-testing)
- [Admin Access](#admin-access)
- [Deployment Notes](#deployment-notes)
- [External Services Setup](#external-services-setup)

---

## Features

### Customer Storefront
- Browsable catalogue with filters (category, price, flavour, dietary, pack size), sorting, and search
- Product detail pages with nutrition facts, ingredients, allergens, reviews
- Cart (guest + authenticated) with local persistence
- Wishlist (guest + authenticated)
- Multi-step checkout: contact → address → review → payment → confirmation
- Cash on Delivery and Razorpay online payment
- Order history, tracking, and account management
- Saved delivery addresses

### Admin Panel (`/admin`)
- Dashboard with revenue/order/customer metrics and trend charts (Recharts)
- Product CRUD (create, edit, archive) with variant management
- Category management
- Order management with fulfilment status updates
- Customer management (view, suspend/activate)
- Coupon management (%, fixed, min order, expiry, usage limits)
- Review moderation (approve/reject/delete)
- Inventory stock adjustment with audit log
- Analytics charts (7d / 30d / 90d / 1y)

### Security
- HttpOnly cookie-based JWT auth (access token 15m, refresh token 7d)
- bcrypt password hashing
- Role-based access control (customer vs admin) enforced on the server
- Server-side price, coupon, and inventory validation
- Razorpay payment signature verification server-side
- Helmet, CORS, and rate limiting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | React Query (TanStack) + Context API |
| Routing | React Router v6 |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (HttpOnly cookies) + bcrypt |
| Payments | Razorpay |
| Email | Nodemailer (Brevo SMTP) |
| Media | Cloudinary (optional) |

---

## Project Structure

```
omastra/
  client/               # React + Vite frontend
    src/
      components/       # Reusable UI + layout components
      context/          # Auth, Cart, Wishlist context providers
      hooks/            # Custom hooks
      lib/              # Axios instance, utils
      pages/            # Route-level pages (admin/, home/, shop/, ...)
      routes/           # AppRouter + ProtectedRoute
      services/         # API call functions
  server/               # Express backend
    src/
      config/           # DB connection
      controllers/      # Route handlers
      middleware/        # auth, errorHandler, upload, validate
      models/           # Mongoose schemas
      routes/           # Express routers
      seeds/            # Demo data seed script
      services/         # Email service
      utils/            # AppError, apiResponse, catchAsync
```

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd omastra

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` and fill in your values:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default 5000) | Yes |
| `NODE_ENV` | `development` or `production` | Yes |
| `CLIENT_URL` | Frontend origin for CORS | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_ACCESS_SECRET` | Secret for access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes |
| `JWT_ACCESS_EXPIRE` | Access token TTL (e.g. `15m`) | Yes |
| `JWT_REFRESH_EXPIRE` | Refresh token TTL (e.g. `7d`) | Yes |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID | Payments |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Payments |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Image uploads |
| `SMTP_HOST` | SMTP host (e.g. smtp-relay.brevo.com) | Emails |
| `SMTP_PORT` | SMTP port (587) | Emails |
| `SMTP_USER` | SMTP user | Emails |
| `SMTP_PASS` | SMTP password | Emails |
| `EMAIL_FROM` | Sender email address | Emails |
| `ADMIN_EMAIL` | Admin account email (seed only) | Seed |
| `ADMIN_PASSWORD` | Admin account password (seed only) | Seed |

### Client (`client/.env`)

```bash
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## Running in Development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`.

---

## Seeding Demo Data

```bash
cd server
npm run seed
```

This creates:
- 1 admin user (credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`)
- 7 product categories
- 15+ fictional demo products across all categories
- Sample coupons (`OMASTRA10`, `WELCOME15`, `SAVE200`)

> **Note:** All seeded products, prices, and nutrition data are **fictional placeholders**. Replace with verified data before launch.

---

## Admin Access

After seeding:

1. Go to `http://localhost:5173/auth/login`
2. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
3. You will be redirected to `/admin`

> Admin access is enforced server-side via `requireAdmin` middleware. UI-only role changes have no effect.

---

## Payment Testing

### Cash on Delivery
No configuration needed. Select "Cash on Delivery" at checkout.

### Razorpay (Test Mode)

1. Create a free Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your **Test** Key ID and Key Secret from the Razorpay Dashboard → Settings → API Keys
3. Add them to `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```
4. Add to `client/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_...
   ```
5. Use Razorpay test card details from their [test documentation](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

> Payment signatures are verified **server-side**. The frontend cannot falsely confirm a payment.

---

## External Services Setup

### Cloudinary (Product Images)
Without Cloudinary, product images use placeholder URLs from the seed. To enable uploads:
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Add credentials to `server/.env`

### Brevo / SMTP (Transactional Email)
Without SMTP config, order confirmation emails are logged to the console. To enable:
1. Create account at [brevo.com](https://brevo.com)
2. Get SMTP credentials from Brevo → SMTP & API
3. Add to `server/.env`

---

## Deployment Notes

1. Set `NODE_ENV=production` in server environment
2. Set `CLIENT_URL` to your production frontend domain
3. Use a strong, random `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
4. Switch Razorpay keys from test to live mode
5. Build the frontend: `cd client && npm run build`
6. Serve the `client/dist` folder from your reverse proxy (Nginx/Caddy) or static hosting
7. Run the backend with a process manager (PM2): `pm2 start src/server.js`

---

## API Overview

All API endpoints are under `/api/v1/`.

| Prefix | Description |
|--------|-------------|
| `/api/v1/auth` | Register, login, logout, refresh, /me |
| `/api/v1/products` | Product catalogue (admin write) |
| `/api/v1/categories` | Categories (admin write) |
| `/api/v1/cart` | Guest + user cart |
| `/api/v1/orders` | Order creation + management |
| `/api/v1/coupons` | Coupon validation + admin CRUD |
| `/api/v1/reviews` | Product reviews + moderation |
| `/api/v1/users` | Profile + addresses |
| `/api/v1/payments` | Razorpay order creation + verification |
| `/api/v1/inventory` | Stock adjustments + logs (admin) |
| `/api/v1/admin` | Dashboard, analytics, customers |

---

## Important Notes

- **All demo data is fictional.** Do not use seeded nutrition values, ingredients, or product claims in production without verification.
- **Never ship `ADMIN_PASSWORD` in source code.** The seed script reads it from `.env` and is development-only.
- **Razorpay** and **Cloudinary** credentials are required for full functionality. The app degrades gracefully without them.
