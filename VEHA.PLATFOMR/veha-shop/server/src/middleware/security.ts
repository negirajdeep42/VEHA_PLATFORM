import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

/**
 * Wires up the baseline security middleware. Order matters:
 * helmet (headers) -> cors (origin allow-list) -> json body limit -> rate limit.
 */
export function applySecurity(app: Express) {
  // 1. Secure HTTP headers (CSP, no-sniff, etc.)
  app.use(helmet());

  // 2. Only allow our own frontend origin(s) to call the API from a browser.
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim());
  app.use(cors({ origin: origins, methods: ['GET', 'POST'] }));

  // 3. Parse JSON but cap the body size to blunt large-payload abuse.
  app.use(express.json({ limit: '64kb' }));

  // 4. Basic rate limiting to slow brute-force / scraping.
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 120,            // 120 requests per IP per minute
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}
