import Database from 'better-sqlite3';
import path from 'path';

const file = process.env.DATABASE_FILE || path.join(process.cwd(), 'veha.db');
export const db = new Database(file);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      category    TEXT NOT NULL,        -- rings | earrings | necklaces | bracelets
      metal       TEXT NOT NULL,        -- gold | rose | silver
      kind        TEXT NOT NULL,        -- ring | earrings | necklace | cuff | hoops | tennis
      price       INTEGER NOT NULL,     -- rupees, integer
      compare_at  INTEGER,              -- original price (for "was")
      badge       TEXT,                 -- e.g. Bestseller / New
      featured    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id              TEXT PRIMARY KEY,
      created_at      TEXT NOT NULL,
      customer_name   TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT NOT NULL,
      address         TEXT NOT NULL,
      city            TEXT NOT NULL,
      state           TEXT NOT NULL,
      pincode         TEXT NOT NULL,
      payment_method  TEXT NOT NULL,    -- upi | card | cod
      subtotal        INTEGER NOT NULL,
      discount        INTEGER NOT NULL,
      shipping        INTEGER NOT NULL,
      total           INTEGER NOT NULL,
      status          TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id  TEXT NOT NULL,
      name        TEXT NOT NULL,
      variant     TEXT,
      price       INTEGER NOT NULL,     -- price captured at purchase time
      qty         INTEGER NOT NULL
    );
  `);
}
