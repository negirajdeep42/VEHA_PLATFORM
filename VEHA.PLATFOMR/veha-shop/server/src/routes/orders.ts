import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import { Order, Product, Promotion, Settings, User } from '../db';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'veha-secret-key-12345';

export const ordersRouter = Router();
const orderIdGen = customAlphabet('0123456789', 6);

// ADMIN: GET /api/orders (List all orders)
ordersRouter.get('/', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).exec();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// ADMIN: GET /api/orders/:id (Get single order details)
ordersRouter.get('/:id', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// ADMIN: PATCH /api/orders/:id/status (Fulfillment status update)
ordersRouter.patch('/:id/status', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid status', details: parsed.error.flatten() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = parsed.data.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders (Create a new customer order)
ordersRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid order request', details: parsed.error.flatten() });
    }

    const { customer, paymentMethod, promoCode, items } = parsed.data;

    // Optional Clerk auth linkage for order records
    const auth = (req as any).auth;
    const userId: string | null = auth?.userId || null;

    // 1. Re-price and check inventory stock of items
    const pricedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Unknown product ID: ${item.productId}` });
      }

      // Check stock availability
      if (product.inventoryQty < item.qty) {
        return res.status(400).json({
          error: `Insufficient stock for product "${product.name}". Available stock: ${product.inventoryQty}`
        });
      }

      pricedItems.push({
        productId: product._id,
        name: product.name,
        variant: item.variant || '',
        price: product.price,
        qty: item.qty,
        productRef: product // hold reference to update stock later
      });
    }

    // 2. Load dynamic shipping rules from Settings db
    const freeShippingThresholdSetting = await Settings.findOne({ key: 'free_shipping_threshold' });
    const shippingFeeSetting = await Settings.findOne({ key: 'shipping_fee' });
    const FREE_SHIPPING_OVER = freeShippingThresholdSetting ? Number(freeShippingThresholdSetting.value) : 999;
    const SHIPPING_FEE = shippingFeeSetting ? Number(shippingFeeSetting.value) : 49;

    // 3. Validate promo code dynamically in the database
    let discountRate = 0;
    let promoDoc = null;
    if (promoCode) {
      const promo = await Promotion.findOne({ code: promoCode.trim().toUpperCase() });
      if (!promo) {
        return res.status(400).json({ error: 'The applied promo code is invalid' });
      }

      // Check Expiration
      if (promo.expirationDate && promo.expirationDate.getTime() < Date.now()) {
        return res.status(400).json({ error: 'The applied promo code has expired' });
      }

      // Check Usage Limit
      if (promo.usageLimit !== null && promo.usageLimit <= promo.usageCount) {
        return res.status(400).json({ error: 'The applied promo code has reached its usage limit' });
      }

      // Enforce One Use Per Customer: check if this customer (by userId or guest email) already has an order using this promo
      const queryFilter: any = {
        promoCode: promoCode.trim().toUpperCase(),
        status: { $ne: 'cancelled' }
      };

      if (userId) {
        queryFilter.$or = [
          { userId },
          { 'customer.email': customer.email.toLowerCase() }
        ];
      } else {
        queryFilter['customer.email'] = customer.email.toLowerCase();
      }

      const existingOrderWithPromo = await Order.findOne(queryFilter).exec();
      if (existingOrderWithPromo) {
        return res.status(400).json({ error: 'You have already used this promotion code.' });
      }

      discountRate = promo.discountRate;
      promoDoc = promo;
    }

    // 4. Calculate prices
    const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Math.round(subtotal * discountRate);
    const shipping = (subtotal - discount) >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
    const total = subtotal - discount + shipping;

    const customId = 'VEHA-' + orderIdGen();

    // 5. Decrement inventory, increment promo usage, and save order
    for (const item of pricedItems) {
      const product = item.productRef;
      product.inventoryQty -= item.qty;
      // Recalculate status
      product.stockStatus = product.inventoryQty === 0 
        ? 'out_of_stock' 
        : product.inventoryQty <= 5 
          ? 'low_stock' 
          : 'in_stock';
      await product.save();
    }

    if (promoDoc) {
      promoDoc.usageCount += 1;
      await promoDoc.save();
    }

    const order = new Order({
      _id: customId,
      userId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode
      },
      items: pricedItems.map(it => ({
        productId: it.productId,
        name: it.name,
        variant: it.variant,
        price: it.price,
        qty: it.qty
      })),
      paymentMethod,
      promoCode: promoCode ? promoCode.toUpperCase().trim() : '',
      subtotal,
      discount,
      shipping,
      total,
      status: 'pending'
    });

    await order.save();

    // Sync checkout shipping details back to the User profile and Clerk metadata
    if (userId) {
      const user = await User.findOne({ clerkId: userId });
      if (user) {
        user.phone = customer.phone || user.phone;
        user.address = customer.address || user.address;
        user.city = customer.city || user.city;
        user.state = customer.state || user.state;
        user.pincode = customer.pincode || user.pincode;
        await user.save();

        if (user.clerkId) {
          try {
            const { clerkClient } = require('@clerk/express');
            await clerkClient.users.updateUserMetadata(user.clerkId, {
              unsafeMetadata: {
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode
              }
            });
          } catch (clerkErr) {
            console.error('Failed to sync checkout address to Clerk metadata:', clerkErr);
          }
        }
      }
    }

    res.status(201).json({
      id: order._id,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      status: order.status
    });

  } catch (err) {
    next(err);
  }
});
