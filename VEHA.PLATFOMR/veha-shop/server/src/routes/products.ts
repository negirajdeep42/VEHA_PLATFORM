import { Router } from 'express';
import { Product } from '../db';
import { productQuerySchema, productAdminSchema } from '../validation/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

export const productsRouter = Router();

// GET /api/products?category=&metal=&sort=&search=
productsRouter.get('/', async (req, res, next) => {
  try {
    const parsed = productQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
    }
    const { category, metal, sort, search } = parsed.data;

    const filter: any = {};
    if (category) filter.category = category;
    if (metal)    filter.metal = metal;
    if (search)   filter.name = { $regex: search, $options: 'i' };

    let mongoQuery = Product.find(filter);

    if (sort === 'low') {
      mongoQuery = mongoQuery.sort({ price: 1 });
    } else if (sort === 'high') {
      mongoQuery = mongoQuery.sort({ price: -1 });
    } else if (sort === 'featured') {
      mongoQuery = mongoQuery.sort({ featured: 1 });
    }

    const rows = await mongoQuery.exec();

    // Custom sorting for discount size ("off")
    if (sort === 'off') {
      rows.sort((a, b) => {
        const offA = a.compareAt ? a.compareAt - a.price : 0;
        const offB = b.compareAt ? b.compareAt - b.price : 0;
        return offB - offA;
      });
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
productsRouter.get('/:id', async (req, res, next) => {
  try {
    const row = await Product.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// ADMIN: POST /api/products (Create a product)
productsRouter.post('/', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const parsed = productAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid product details', details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const slug = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check duplicate ID
    const exists = await Product.findById(slug);
    if (exists) {
      return res.status(409).json({ error: `Product ID "${slug}" already exists.` });
    }

    const qty = data.inventoryQty ?? 100;
    const status = qty === 0 ? 'out_of_stock' : qty <= 5 ? 'low_stock' : 'in_stock';

    const product = new Product({
      _id: slug,
      name: data.name,
      category: data.category,
      metal: data.metal,
      kind: data.kind,
      price: data.price,
      compareAt: data.compareAt ?? null,
      badge: data.badge ?? null,
      featured: data.featured ?? 0,
      inventoryQty: qty,
      stockStatus: status,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// ADMIN: PUT /api/products/:id (Update a product)
productsRouter.put('/:id', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const parsed = productAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid product details', details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const qty = data.inventoryQty ?? product.inventoryQty;
    const status = qty === 0 ? 'out_of_stock' : qty <= 5 ? 'low_stock' : 'in_stock';

    product.name = data.name;
    product.category = data.category;
    product.metal = data.metal;
    product.kind = data.kind;
    product.price = data.price;
    product.compareAt = data.compareAt ?? null;
    product.badge = data.badge ?? null;
    product.featured = data.featured ?? product.featured;
    product.inventoryQty = qty;
    product.stockStatus = status;

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ADMIN: DELETE /api/products/:id (Delete a product)
productsRouter.delete('/:id', verifyToken as any, requireAdmin as any, async (req, res, next) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true, message: `Product "${req.params.id}" has been deleted.` });
  } catch (err) {
    next(err);
  }
});
