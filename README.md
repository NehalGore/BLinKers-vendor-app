# 🛒 BLinkeRs — Hyperlocal Delivery Platform

> Built for Tier-2 / Tier-3 Indian cities. 10–20 minute delivery from local kirana stores.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Supabase-orange)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Codespaces-blue)

---

## 🚀 Live Apps

| App | URL |
|-----|-----|
| 🛍️ Customer App | `/` — Browse, checkout, track orders |
| 🏪 Vendor App | `/vendor` — Orders, inventory, sales |

---

## 📱 What's Built

### Customer App (`/`)
- Product listing — live from Supabase, sorted by sales velocity
- Category filters — Essentials, Snacks, Beverages, Dairy, Instant Food
- Add to cart with inline quantity stepper
- 3-step checkout — Order summary → Delivery address → Payment
- Order placement — saves directly to Supabase database
- Real-time order tracking — placed → packed → picked → delivered
- COD and UPI payment options

### Vendor App (`/vendor`)

**📋 Orders Tab**
- Live incoming orders via Supabase Realtime
- SLA countdown timer (5 minutes to pack)
- Packing checklist — tap to check off each item
- Mark as Packed → auto-deducts stock from inventory
- Rider auto-assignment after packing
- Issue reporting (out of stock, wrong qty, damaged)

**📦 Inventory Tab**
- Live stock levels from Supabase
- Color-coded status — Red (OOS), Yellow (Low), Green (Healthy)
- Reorder suggestions based on 7-day avg daily sales
- Add stock with preset buttons (+5, +10, +20, +50)
- Mark Out of Stock / Relist items
- Search by product name or SKU
- Filter tabs — All, Low Stock, Fast Moving, Out of Stock

**💰 Sales Tab**
- Daily earnings summary — Gross Sales, Net Earnings
- Deductions breakdown — Platform fee, Refunds
- Payout status — Pending / Processing / Completed
- Full order history with tap-to-expand details
- Settlement to UPI

---

## 🗄️ Backend — Supabase

### Database Tables
```
vendors              — Store profiles
products             — Product catalogue
vendor_products      — Stock levels per vendor
orders               — Customer orders
order_items          — Items per order
delivery_partners    — Rider profiles
delivery_tracking    — Pickup & delivery timestamps
billing_sales        — POS / QR billing data
alerts               — Low stock, SLA breach alerts
```

### Features Used
- ✅ PostgreSQL — relational data with foreign keys
- ✅ Row Level Security — vendors see only their data
- ✅ Realtime — live order updates via websocket
- ✅ REST API — auto-generated from schema

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Auth | Supabase Auth (coming) |
| Hosting | GitHub Codespaces / Vercel |
| Fonts | DM Sans + Syne (Google Fonts) |

---

## 🏃 Run Locally
```bash
# Clone the repo
git clone https://github.com/NehalGore/BLinkers-vendor-app.git
cd BLinkers-vendor-app

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start dev server
npm run dev -- --host
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these from:
**Supabase Dashboard → Settings → API**

---

## 📁 Project Structure
```
blinkers-vendor-app/
├── src/
│   ├── customer/
│   │   └── CustomerApp.jsx     # Full customer flow
│   ├── vendor/
│   │   └── VendorApp.jsx       # Full vendor dashboard
│   ├── shared/
│   │   ├── supabase.js         # Supabase client
│   │   ├── data.js             # Shared constants
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Router + connection banner
│   └── main.jsx                # React entry point
├── index.html
├── vite.config.js
├── package.json
└── .env.local                  # Never commit this
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Core (Complete)
- [x] Customer product listing
- [x] Checkout flow
- [x] Order tracking
- [x] Vendor order management
- [x] Inventory management
- [x] Daily sales & payout summary
- [x] Supabase backend connected

### 🔄 Phase 2 — Authentication (Next)
- [ ] Supabase Auth — vendor login
- [ ] Customer accounts
- [ ] Role-based routing (vendor vs customer vs rider)

### 📱 Phase 3 — Rider App
- [ ] `/rider` route
- [ ] Active delivery screen
- [ ] Confirm pickup / delivery buttons
- [ ] Earnings history

### 🚀 Phase 4 — Production Deploy
- [ ] Deploy to Vercel
- [ ] Custom domain
- [ ] PWA — installable on Android

### 🤖 Phase 5 — Intelligence
- [ ] Nightly inventory optimisation (pg_cron)
- [ ] Auto reorder suggestions
- [ ] Sales forecasting
- [ ] Slow-mover auto-delist

---

## 👤 Built By

**Nehal Gore**
GitHub: [@NehalGore](https://github.com/NehalGore)

---

## 📄 License

MIT — free to use and modify.

---

> *BLinkeRs is designed for real pilots in Tier-2/3 Indian cities.
> Built with speed, clarity, and zero operational confusion.*
