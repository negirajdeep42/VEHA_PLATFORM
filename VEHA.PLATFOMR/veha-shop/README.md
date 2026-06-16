# Veha Jewelry — full-stack shop

A small but real e-commerce foundation for the Veha store.

- **Frontend:** React + TypeScript + Vite + Tailwind CSS, state with **Redux Toolkit** and the API layer with **RTK Query**.
- **Backend:** Node + Express + TypeScript, **SQLite** database (via better-sqlite3).
- **Flow:** shop → product → cart → checkout → order saved in the database.

```
veha-shop/
├─ server/   # Express API + SQLite
└─ client/   # React app
```

## 1. Run the backend

```bash
cd server
cp .env.example .env        # edit if you like
npm install
npm run seed                # creates veha.db and inserts the 8 products
npm run dev                 # API on http://localhost:4000
```

Quick check: open http://localhost:4000/api/products — you should see JSON.

## 2. Run the frontend (in a second terminal)

```bash
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                 # app on http://localhost:5173
```

Open http://localhost:5173. Add items, go to the cart, then checkout. A real
order row is written to `server/veha.db` and you get an order number back.

## How the pieces connect

- `client/src/features/api/apiSlice.ts` — RTK Query endpoints (`getProducts`,
  `getProduct`, `createOrder`). This is the typed "redux api".
- `client/src/features/cart/cartSlice.ts` — the cart in Redux, persisted to
  `localStorage` so it survives refreshes.
- `server/src/routes/products.ts` — reads products from SQLite.
- `server/src/routes/orders.ts` — validates the order and **re-prices it from
  the database** before saving.

## Security choices (and what is intentionally NOT here)

What is wired in:

- **Server-side pricing.** The client only sends `productId`, `variant`, `qty`.
  The server looks up the real price from the DB and computes the total, so a
  tampered request can't change what something costs.
- **Input validation** with Zod on every request body and query string.
- **Parameterised SQL** everywhere (bound parameters, never string-built SQL) —
  this is what prevents SQL injection.
- **helmet** for safe HTTP headers, **CORS** locked to your frontend origin,
  a **request rate limit**, and a **JSON body size cap**.
- **No card data** is ever sent to or stored by this server.

What you still need before taking real money / going live:

1. **A payment gateway** (in India, Razorpay or PayU; or Stripe). The server
   would create a payment order and verify the gateway's signed callback.
2. **HTTPS** in production (a reverse proxy like Nginx, or your host's TLS).
3. **Accounts/auth** if you want logins — store only *hashed* passwords
   (bcrypt/argon2), and use signed session cookies or JWTs.
4. **Postgres or MySQL** instead of SQLite for a real deployment. Because all
   queries are parameterised, switching the driver is a contained change.
5. Secrets in environment variables (never commit `.env`).

## Notes

- The fancy multi-view product gallery and the elaborate landing page from the
  original static site can be ported in gradually — the design tokens already
  live in `client/tailwind.config.ts`, so styling stays consistent.
