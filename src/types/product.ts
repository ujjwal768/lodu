export enum ProductCategory {
  CLOTHING = 'clothing',
  ELECTRONICS = 'electronics',
  HOME = 'home',
  BEAUTY = 'beauty',
  BOOKS = 'books',
  FOOD = 'food',
  OTHER = 'other',
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  inventory: number;
  variants: ProductVariant[];
  featured: boolean;
  createdAt: string;
}