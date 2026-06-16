import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import { db } from '../db';
import { createOrderSchema } from '../validation/schemas';

export const ordersRouter = Router();
const orderId = customAlphabet('0123456789', 6);

const FREE_SHIPPING_OVER = 999;
const SHIPPING_FEE = 49;
const PROMOS: Record<string, number> = { VEHA10: 0.10 }; // code -> fraction off

// POST /api/orders
ordersRouter.post('/', (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid order', details: parsed.error.flatten() });
  }
  const { customer, paymentMethod, promoCode, items } = parsed.data;

  // Re-price every line from the DB. The client cannot dictate prices.
  const getProduct = db.prepare('SELECT id, name, price FROM products WHERE id = ?');
  const priced = items.map((line) => {
    const p = getProduct.get(line.productId) as
      | { id: string; name: string; price: number }
      | undefined;
    if (!p) throw { status: 400, message: `Unknown product: ${line.productId}` };
    return { productId: p.id, name: p.name, variant: line.variant ?? '', price: p.price, qty: line.qty };
  });

  const subtotal = priced.reduce((s, l) => s + l.price * l.qty, 0);
  const rate = promoCode ? PROMOS[promoCode.trim().toUpperCase()] ?? 0 : 0;
  const discount = Math.round(subtotal * rate);
  const shipping = subtotal - discount >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  const id = 'VEHA-' + orderId();
  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO orders
        (id, created_at, customer_name, email, phone, address, city, state, pincode,
         payment_method, subtotal, discount, shipping, total, status)
       VALUES
        (@id, @created_at, @name, @email, @phone, @address, @city, @state, @pincode,
         @payment_method, @subtotal, @discount, @shipping, @total, 'pending')`
    ).run({
      id, created_at: now,
      name: customer.name, email: customer.email, phone: customer.phone,
      address: customer.address, city: customer.city, state: customer.state, pincode: customer.pincode,
      payment_method: paymentMethod, subtotal, discount, shipping, total,
    });

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, name, variant, price, qty)
       VALUES (@order_id, @product_id, @name, @variant, @price, @qty)`
    );
    priced.forEach((l) =>
      insertItem.run({ order_id: id, product_id: l.productId, name: l.name, variant: l.variant, price: l.price, qty: l.qty })
    );
  });
  tx();

  // NOTE: no card data is ever received or stored. A real charge would be
  // handled by a payment gateway (Razorpay/Stripe) using the returned total.
  res.status(201).json({ id, subtotal, discount, shipping, total, status: 'pending' });
});
