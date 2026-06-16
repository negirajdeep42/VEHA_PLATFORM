import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, Product, Promotion, Settings, Order, User } from './db';

const PRODUCTS = [
  { _id: 'aria-wave-cuff',       name: 'Aria Wave Cuff',       category: 'bracelets', metal: 'gold',   kind: 'cuff',     price: 1425, compareAt: 2499, badge: 'Bestseller', featured: 1, inventoryQty: 45, stockStatus: 'in_stock' },
  { _id: 'lumen-solitaire',      name: 'Lumen Solitaire',      category: 'rings',     metal: 'gold',   kind: 'ring',     price: 1899, compareAt: 2999, badge: null,         featured: 2, inventoryQty: 12, stockStatus: 'in_stock' },
  { _id: 'seraphine-drops',      name: 'Seraphine Drops',      category: 'earrings',  metal: 'gold',   kind: 'earrings', price: 1650, compareAt: 2799, badge: 'New',        featured: 3, inventoryQty: 0,  stockStatus: 'out_of_stock' },
  { _id: 'mira-pendant-chain',   name: 'Mira Pendant Chain',   category: 'necklaces', metal: 'gold',   kind: 'necklace', price: 2150, compareAt: 3499, badge: null,         featured: 4, inventoryQty: 24, stockStatus: 'in_stock' },
  { _id: 'celeste-halo-ring',    name: 'Celeste Halo Ring',    category: 'rings',     metal: 'rose',   kind: 'ring',     price: 2299, compareAt: 3799, badge: null,         featured: 5, inventoryQty: 5,  stockStatus: 'low_stock' },
  { _id: 'aurelia-hoops',        name: 'Aurelia Hoops',        category: 'earrings',  metal: 'silver', kind: 'hoops',    price: 1299, compareAt: 2099, badge: null,         featured: 6, inventoryQty: 80, stockStatus: 'in_stock' },
  { _id: 'noor-tennis-bracelet', name: 'Noor Tennis Bracelet', category: 'bracelets', metal: 'silver', kind: 'tennis',   price: 2899, compareAt: 4499, badge: null,         featured: 7, inventoryQty: 18, stockStatus: 'in_stock' },
  { _id: 'vela-layered-necklace',name: 'Vela Layered Necklace',category: 'necklaces', metal: 'rose',   kind: 'necklace', price: 2499, compareAt: 3999, badge: null,         featured: 8, inventoryQty: 15, stockStatus: 'in_stock' },
];

const PROMOTIONS = [
  { code: 'VEHA10', discountRate: 0.10, expirationDate: null, usageLimit: 200, usageCount: 0 },
  { code: 'WELCOME20', discountRate: 0.20, expirationDate: null, usageLimit: 50, usageCount: 0 }
];

const SETTINGS = [
  { key: 'shipping_fee', value: 49 },
  { key: 'free_shipping_threshold', value: 999 }
];

async function seed() {
  await connectDB();
  console.log('Seeding MongoDB database with Auth and Catalog entries...');

  // Drop collections
  await Product.deleteMany({});
  await Promotion.deleteMany({});
  await Settings.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing collections.');

  // Seed Products
  await Product.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products.`);

  // Seed Promo Codes
  await Promotion.insertMany(PROMOTIONS);
  console.log(`Seeded ${PROMOTIONS.length} promotions.`);

  // Seed Settings
  await Settings.insertMany(SETTINGS);
  console.log(`Seeded ${SETTINGS.length} settings configuration keys.`);

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('AdminVeha123', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123', 10);

  // Seed Users
  const users = [
    {
      name: 'Veha Atelier Admin',
      email: 'admin@veha.example',
      passwordHash: adminPasswordHash,
      role: 'admin'
    },
    {
      name: 'Aditi Sharma',
      email: 'customer@veha.example',
      passwordHash: customerPasswordHash,
      phone: '+91 98765 43210',
      address: '45, Royal Enclave, Malviya Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302017',
      role: 'customer'
    }
  ];

  await User.insertMany(users);
  console.log(`Seeded ${users.length} users (1 Admin, 1 Customer).`);

  console.log('Database seeding complete!');
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err);
  await mongoose.connection.close();
  process.exit(1);
});
