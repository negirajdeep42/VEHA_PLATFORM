import 'dotenv/config';
import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import { applySecurity } from './middleware/security';
import { connectDB } from './db';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { authRouter } from './routes/auth';
import { promotionsRouter } from './routes/promotions';

const app = express();
applySecurity(app);
app.use(clerkMiddleware());
connectDB();

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/promotions', promotionsRouter);

// Central error handler (keeps internal details out of responses).
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err?.status ?? 500;
  const message = err?.message ?? 'Something went wrong';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Veha API listening on http://localhost:${port}`));
