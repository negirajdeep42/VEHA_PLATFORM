import mongoose, { Schema, Document } from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/veha';

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// 1. User Schema
export interface IUser {
  _id: mongoose.Types.ObjectId;
  clerkId?: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: 'customer' | 'admin';
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  role: { type: String, default: 'customer', enum: ['customer', 'admin'] }
});

export const User = mongoose.model<IUser>('User', UserSchema);

// 2. Product Schema
export interface IProduct {
  _id: string; // override default ObjectId to use custom string IDs
  name: string;
  category: 'rings' | 'earrings' | 'necklaces' | 'bracelets';
  metal: 'gold' | 'rose' | 'silver';
  kind: string;
  price: number;
  compareAt: number | null;
  badge: string | null;
  featured: number;
  inventoryQty: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ProductSchema = new Schema<IProduct>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['rings', 'earrings', 'necklaces', 'bracelets'] },
  metal: { type: String, required: true, enum: ['gold', 'rose', 'silver'] },
  kind: { type: String, required: true },
  price: { type: Number, required: true },
  compareAt: { type: Number, default: null },
  badge: { type: String, default: null },
  featured: { type: Number, default: 0 },
  inventoryQty: { type: Number, default: 100 },
  stockStatus: { type: String, default: 'in_stock', enum: ['in_stock', 'low_stock', 'out_of_stock'] }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

// 3. Promotion Schema
export interface IPromotion {
  code: string;
  discountRate: number;
  expirationDate: Date | null;
  usageLimit: number | null;
  usageCount: number;
}

const PromotionSchema = new Schema<IPromotion>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountRate: { type: Number, required: true },
  expirationDate: { type: Date, default: null },
  usageLimit: { type: Number, default: null },
  usageCount: { type: Number, default: 0 }
});

export const Promotion = mongoose.model<IPromotion>('Promotion', PromotionSchema);

// 4. Settings Schema
export interface ISettings {
  key: string;
  value: any;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }
});

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);

// 5. Order Schema
export interface IOrder {
  _id: string; // custom generated ID like VEHA-XXXXXX
  createdAt: Date;
  userId: string | null; // references User model _id string
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    variant: string;
    price: number;
    qty: number;
  }>;
  paymentMethod: 'upi' | 'card' | 'cod';
  promoCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
}

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, default: null },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    variant: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true }
  }],
  paymentMethod: { type: String, required: true, enum: ['upi', 'card', 'cod'] },
  promoCode: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'shipped', 'delivered'] }
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
