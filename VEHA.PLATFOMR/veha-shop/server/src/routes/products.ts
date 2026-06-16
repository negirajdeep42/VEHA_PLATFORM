import { Router } from 'express';
import { db } from '../db';
import { productQuerySchema } from '../validation/schemas';

export const productsRouter = Router();

// GET /api/products?category=&metal=&sort=
productsRouter.get('/', (req, res) => {
  const parsed = productQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
  }
  const { category, metal, sort } = parsed.data;

  // Build a parameterised query (no string concatenation of user input).
  const where: string[] = [];
  const params: Record<string, string> = {};
  if (category) { where.push('category = @category'); params.category = category; }
  if (metal)    { where.push('metal = @metal');       params.metal = metal; }

  let orderBy = 'featured ASC';
  if (sort === 'low')  orderBy = 'price ASC';
  if (sort === 'high') orderBy = 'price DESC';
  if (sort === 'off')  orderBy = '(compare_at - price) DESC';

  const sql =
    `SELECT id, name, category, metal, kind, price, compare_at AS compareAt, badge, featured
     FROM products ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY ${orderBy}`;

  const rows = db.prepare(sql).all(params);
  res.json(rows);
});

// GET /api/products/:id
productsRouter.get('/:id', (req, res) => {
  const row = db
    .prepare(
      `SELECT id, name, category, metal, kind, price, compare_at AS compareAt, badge, featured
       FROM products WHERE id = ?`
    )
    .get(req.params.id); // bound parameter -> injection-safe
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});
