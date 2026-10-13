# OMASTRA Agent Notes

## Project Overview
OMASTRA is a modern Indian sports-nutrition e-commerce platform built with:
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Payments**: Razorpay (sandbox)
- **Media**: Cloudinary
- **Email**: Brevo

## Build Phases
- [x] Phase 1: Visual foundation (header, homepage, footer, design system)
- [x] Phase 2: Catalogue (shop, filters, product details, seed data)
- [x] Phase 3: Accounts & shopping (auth, cart, wishlist)
- [x] Phase 4: Checkout (coupons, orders, payments)
- [x] Phase 5: Admin dashboard
- [ ] Phase 6: Finish & verify (email and README exist; automated tests and end-to-end verification remain)

The implementation phases above have code in place. Current verification: frontend production build and desktop/mobile storefront render pass; no automated test files or ESLint configuration are present yet.

## Key Decisions
- Monorepo: `client/` + `server/` in the same repo
- API versioned at `/api/v1`
- JWT stored in HttpOnly cookies (no localStorage for auth tokens)
- Guest cart persisted in localStorage, merged on login
- Admin role enforced server-side on every route
- Price/coupon/stock always recalculated server-side at checkout
