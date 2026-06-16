import { Router } from 'express';
import { z } from 'zod';
import { Promotion } from '../db';
import { verifyToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const promotionsRouter = Router();

const promotionAdminSchema = z.object({
  code: z.string().min(1).max(40).regex(/^[a-zA-Z0-9]+$/, 'Code must be alphanumeric').transform(val => val.toUpperCase().trim()),
  discountRate: z.number().min(0.01).max(0.99),
  expirationDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  usageLimit: z.number().int().min(1).nullable().optional(),
});

// All promotions routes require authentication and admin role
promotionsRouter.use(verifyToken as any, requireAdmin as any);

// GET /api/promotions (List all promotion codes)
promotionsRouter.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await Promotion.find({}).sort({ code: 1 }).exec();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/promotions (Create a new promo code)
promotionsRouter.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = promotionAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid details', details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Check duplicate
    const exists = await Promotion.findOne({ code: data.code });
    if (exists) {
      return res.status(409).json({ error: `Promo code "${data.code}" already exists.` });
    }

    const promotion = new Promotion({
      code: data.code,
      discountRate: data.discountRate,
      expirationDate: data.expirationDate || null,
      usageLimit: data.usageLimit ?? null,
      usageCount: 0
    });

    await promotion.save();
    res.status(201).json(promotion);
  } catch (err) {
    next(err);
  }
});

// PUT /api/promotions/:id (Update promotion settings)
promotionsRouter.put('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = promotionAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid details', details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ error: 'Promotion not found' });

    promo.discountRate = data.discountRate;
    promo.expirationDate = data.expirationDate || null;
    promo.usageLimit = data.usageLimit ?? null;

    await promo.save();
    res.json(promo);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/promotions/:id (Delete a promo code)
promotionsRouter.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await Promotion.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Promotion not found' });
    res.json({ ok: true, message: `Promo code has been deleted.` });
  } catch (err) {
    next(err);
  }
});
