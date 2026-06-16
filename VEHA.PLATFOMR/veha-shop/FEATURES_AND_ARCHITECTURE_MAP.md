# Veha Jewelry Shop — Features & Architecture Map

This reference document outlines all currently implemented features, business logic, design assets, and their file locations across the frontend and backend of the Veha Jewelry application.

---

## 📂 Project Structure Overview
The full-stack application resides within the `veha-shop` directory:
```
veha-shop/
├── client/     # Frontend SPA (React + TypeScript + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── app/         # Redux store configuration and Hooks
│   │   ├── components/  # Reusable UI components (Header, Footer, Drawers)
│   │   ├── features/    # Redux slices (Cart, Auth) and RTK Query API slice
│   │   ├── lib/         # Formatting helpers and SVG render shapes
│   │   └── pages/       # SPA Views (Home, Shop, Product, Admin, Checkout)
│   └── tailwind.config.ts
└── server/     # Backend REST API (Node.js + Express + MongoDB + Mongoose + TypeScript)
    ├── src/
    │   ├── middleware/  # Security, CORS, and Clerk session verify logic
    │   ├── routes/      # Products, Orders, Auth, and Promotions routers
    │   ├── validation/  # Zod validation schemas
    │   ├── db.ts        # MongoDB Mongoose connection and model schemas
    │   ├── index.ts     # Express server entry point
    │   └── seed.ts      # Database seeder (products, settings, promotions)
```

---

## 💻 Frontend (Client) Feature Map

### 1. Authentication & Session Synchronization (Clerk)
* **Clerk Wrapper Integration:** Wraps routing and children in `<ClerkProvider>` to trigger secure, interactive modal login flows.
  * 📍 **Location:** [App.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/App.tsx)
* **Redux Auth Sync:** A synchronization wrapper (`ClerkReduxSync`) listens to Clerk's session events, extracts JWT tokens, and populates the store state so existing selectors remain active.
  * 📍 **Location:** [App.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/App.tsx#L20-L54)
* **Account Drawer Dialog:** Mounts Clerk's modal triggers (`SignInButton`, `SignUpButton`) for guests, and displays profile details + database order history for authenticated accounts.
  * 📍 **Location:** [Drawers.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/components/Drawers.tsx#L123-L260)

### 2. State Management & Cart Persistence
* **Redux Store Setup:** Integrates Local Cart slice, Clerk Auth slice, and the RTK Query cache.
  * 📍 **Location:** [store.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/app/store.ts)
* **Cart Slice:** Redux actions (`addItem`, `setQty`, `removeItem`, `clearCart`) and selectors.
  * 📍 **Location:** [cartSlice.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/features/cart/cartSlice.ts)

### 3. RTK Query API Layer
* **API Endpoints Definitions:** Configures queries and mutations (attaches authorization Bearer tokens dynamically via `prepareHeaders` header interceptor):
  * **Auth Endpoints:** `/auth/me` and `/auth/orders`.
  * **Catalog Endpoints:** Product list fetching and CRUD.
  * **Orders Endpoints:** Place customer order and admin order listing / patch updates.
  * **Promotions Endpoints:** Promotions CRUD for coupon management.
  * 📍 **Location:** [apiSlice.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/features/api/apiSlice.ts)

### 4. Protected Admin Dashboard (`/admin`)
* **Admin Guard:** Checks if `isAuthenticated === true` and `user.role === 'admin'`. Unauthorized visits show an **Access Denied** notice.
  * 📍 **Location:** [Admin.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/pages/Admin.tsx#L41-L79)
* **Manage Orders:** Lists orders with filters (Pending, Shipped, Delivered) and status change controls.
  * 📍 **Location:** [Admin.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/pages/Admin.tsx#L298-L413)
* **Manage Products:** Handles catalog additions, edits, pricing adjustments, inventory levels, and deletion.
  * 📍 **Location:** [Admin.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/pages/Admin.tsx#L415-L492)
* **Manage Promotions:** Offers tables and forms to configure coupon codes, discount rates, expiry dates, and usage limits.
  * 📍 **Location:** [Admin.tsx](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/client/src/pages/Admin.tsx#L494-L650)

---

## ⚙️ Backend (Server) Feature Map

### 1. Server Configuration & Clerk Middleware
* **Clerk Middleware:** Mounts `@clerk/express` SDK middleware to verify session states and inject decoded authentication contexts onto `req.auth`.
  * 📍 **Location:** [index.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/index.ts#L13)
* **Auth Guard Middleware:** Contains:
  * `verifyToken`: Validates `req.auth`. Maps/seeds the Clerk profile into a Mongoose database `User` record if it's their first sign-in.
  * `requireAdmin`: Checks `req.user.role === 'admin'` to block endpoint access.
  * 📍 **Location:** [auth.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/middleware/auth.ts)

### 2. MongoDB Database & Schemas (Mongoose)
* **DB Connection:** Initialises connection to the local database (`mongodb://localhost:27017/veha`).
  * 📍 **Location:** [db.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/db.ts#L5-L13)
* **Model Schemas:** Defines schemas for `User`, `Product`, `Promotion`, `Settings` and `Order` models.
  * 📍 **Location:** [db.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/db.ts#L15-L166)

### 3. API Routers
* **Orders Router (`/api/orders`):**
  * `POST /`: Creates customer orders. Enforces **"One Use Per Customer"** rules by verifying past orders for the email/userId, decrements inventory stock, increments coupon counters, and links the order to the customer.
  * `GET /` & `PATCH /:id/status`: Administrative endpoints to query details and change status.
  * 📍 **Location:** [orders.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/routes/orders.ts)
* **Promotions Router (`/api/promotions`):**
  * Express endpoints supporting complete Administrative CRUD operations for active coupon codes.
  * 📍 **Location:** [promotions.ts](file:///h:/paid/VEHA_PLATFORM/VEHA.PLATFOMR/veha-shop/server/src/routes/promotions.ts)
