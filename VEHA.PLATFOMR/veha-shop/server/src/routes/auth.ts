import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, Order } from '../db';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'veha-secret-key-12345';

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  password: z.string().min(6).max(80),
  phone: z.string().min(6).max(20).optional(),
  address: z.string().min(1).max(240).optional(),
  city: z.string().min(1).max(80).optional(),
  state: z.string().min(1).max(80).optional(),
  pincode: z.string().min(4).max(12).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
authRouter.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid details', details: parsed.error.flatten() });
    }

    const { name, email, password, phone, address, city, state, pincode } = parsed.data;

    // Check duplicate
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'Account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      role: 'customer' // default role is customer
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid details', details: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
authRouter.get('/me', verifyToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    state: user.state,
    pincode: user.pincode,
    role: user.role
  });
});

// GET /api/auth/orders (Get current logged-in customer's order history)
authRouter.get('/orders', verifyToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const orders = await Order.find({
      $or: [
        { userId: String(user._id) },
        { 'customer.email': user.email }
      ]
    }).sort({ createdAt: -1 }).exec();

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile (Update profile/shipping address)
authRouter.put('/profile', verifyToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const { name, phone, address, city, state, pincode } = req.body;

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.city = city ?? user.city;
    user.state = state ?? user.state;
    user.pincode = pincode ?? user.pincode;

    await user.save();

    // If user has a clerkId, sync back to Clerk unsafeMetadata for consistency
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
        console.error('Failed to sync updated address to Clerk metadata:', clerkErr);
      }
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
});
