export type Category = 'rings' | 'earrings' | 'necklaces' | 'bracelets';
export type Metal = 'gold' | 'rose' | 'silver';
export type Kind = 'ring' | 'earrings' | 'necklace' | 'cuff' | 'hoops' | 'tennis';

export interface Product {
  id: string;
  name: string;
  category: Category;
  metal: Metal;
  kind: Kind;
  price: number;
  compareAt: number | null;
  badge: string | null;
  featured: number;
}

export interface CartItem {
  id: string;        // unique per product+variant
  productId: string; // the product it maps to
  name: string;
  variant: string;
  price: number;
  qty: number;
  kind: Kind;
}

export interface OrderResult {
  id: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
}
