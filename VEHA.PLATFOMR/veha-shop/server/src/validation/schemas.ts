import { z } from 'zod';

// Query params for listing products (all optional, all whitelisted).
export const productQuerySchema = z.object({
  category: z.enum(['rings', 'earrings', 'necklaces', 'bracelets']).optional(),
  metal: z.enum(['gold', 'rose', 'silver']).optional(),
  sort: z.enum(['featured', 'low', 'high', 'off']).optional(),
});

// A single line the client wants to order. NOTE: no price here —
// the server looks up the real price from the DB. Never trust client prices.
const orderItemSchema = z.object({
  productId: z.string().min(1).max(64),
  variant: z.string().max(120).optional(),
  qty: z.number().int().min(1).max(20),
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(160),
    phone: z.string().min(6).max(20),
    address: z.string().min(1).max(240),
    city: z.string().min(1).max(80),
    state: z.string().min(1).max(80),
    pincode: z.string().min(4).max(12),
  }),
  paymentMethod: z.enum(['upi', 'card', 'cod']),
  promoCode: z.string().max(40).optional(),
  items: z.array(orderItemSchema).min(1).max(50),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
