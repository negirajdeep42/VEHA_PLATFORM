import 'dotenv/config';
import { db, initSchema } from './db';

const PRODUCTS = [
  { id: 'aria-wave-cuff',       name: 'Aria Wave Cuff',       category: 'bracelets', metal: 'gold',   kind: 'cuff',     price: 1425, compare_at: 2499, badge: 'Bestseller', featured: 1 },
  { id: 'lumen-solitaire',      name: 'Lumen Solitaire',      category: 'rings',     metal: 'gold',   kind: 'ring',     price: 1899, compare_at: 2999, badge: null,         featured: 2 },
  { id: 'seraphine-drops',      name: 'Seraphine Drops',      category: 'earrings',  metal: 'gold',   kind: 'earrings', price: 1650, compare_at: 2799, badge: 'New',        featured: 3 },
  { id: 'mira-pendant-chain',   name: 'Mira Pendant Chain',   category: 'necklaces', metal: 'gold',   kind: 'necklace', price: 2150, compare_at: 3499, badge: null,         featured: 4 },
  { id: 'celeste-halo-ring',    name: 'Celeste Halo Ring',    category: 'rings',     metal: 'rose',   kind: 'ring',     price: 2299, compare_at: 3799, badge: null,         featured: 5 },
  { id: 'aurelia-hoops',        name: 'Aurelia Hoops',        category: 'earrings',  metal: 'silver', kind: 'hoops',    price: 1299, compare_at: 2099, badge: null,         featured: 6 },
  { id: 'noor-tennis-bracelet', name: 'Noor Tennis Bracelet', category: 'bracelets', metal: 'silver', kind: 'tennis',   price: 2899, compare_at: 4499, badge: null,         featured: 7 },
  { id: 'vela-layered-necklace',name: 'Vela Layered Necklace',category: 'necklaces', metal: 'rose',   kind: 'necklace', price: 2499, compare_at: 3999, badge: null,         featured: 8 },
];

initSchema();
const insert = db.prepare(
  `INSERT OR REPLACE INTO products (id,name,category,metal,kind,price,compare_at,badge,featured)
   VALUES (@id,@name,@category,@metal,@kind,@price,@compare_at,@badge,@featured)`
);
const tx = db.transaction((rows: typeof PRODUCTS) => rows.forEach((r) => insert.run(r)));
tx(PRODUCTS);
console.log(`Seeded ${PRODUCTS.length} products.`);
