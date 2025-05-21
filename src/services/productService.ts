import { Product, ProductCategory } from '../types/product';

// Mock products data - in a real app, this would come from your backend
let MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sellerId: '1',
    name: 'Premium T-Shirt',
    description: 'A comfortable, casual fit t-shirt made from high-quality cotton.',
    price: 24.99,
    images: [
      'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: ProductCategory.CLOTHING,
    inventory: 50,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Black', 'White', 'Blue'] },
    ],
    featured: true,
    createdAt: '2023-02-15T12:00:00Z',
  },
  {
    id: '2',
    sellerId: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation technology.',
    price: 129.99,
    images: [
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8412415/pexels-photo-8412415.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: ProductCategory.ELECTRONICS,
    inventory: 25,
    variants: [
      { name: 'Color', options: ['Black', 'Silver', 'Rose Gold'] },
    ],
    featured: true,
    createdAt: '2023-03-10T12:00:00Z',
  },
  {
    id: '3',
    sellerId: '1',
    name: 'Ceramic Mug',
    description: 'Handcrafted ceramic mug, perfect for your morning coffee or tea.',
    price: 18.99,
    images: [
      'https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: ProductCategory.HOME,
    inventory: 75,
    variants: [
      { name: 'Color', options: ['White', 'Black', 'Green', 'Blue'] },
    ],
    featured: false,
    createdAt: '2023-02-28T12:00:00Z',
  },
  {
    id: '4',
    sellerId: '1',
    name: 'Digital Camera',
    description: 'Professional digital camera with 24MP sensor and 4K video recording.',
    price: 899.99,
    images: [
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2929411/pexels-photo-2929411.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: ProductCategory.ELECTRONICS,
    inventory: 10,
    variants: [],
    featured: true,
    createdAt: '2023-01-20T12:00:00Z',
  },
];

export const getProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 500);
  });
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.id === id) || null;
      resolve(product);
    }, 300);
  });
};

export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const products = MOCK_PRODUCTS.filter(p => p.category === category);
      resolve(products);
    }, 500);
  });
};

export const getSellerProducts = async (sellerId: string): Promise<Product[]> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const products = MOCK_PRODUCTS.filter(p => p.sellerId === sellerId);
      resolve(products);
    }, 500);
  });
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const newProduct: Product = {
        ...product,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      
      MOCK_PRODUCTS.push(newProduct);
      resolve(newProduct);
    }, 800);
  });
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
      
      if (index === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...updates };
      resolve(MOCK_PRODUCTS[index]);
    }, 800);
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = MOCK_PRODUCTS.length;
      MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
      
      if (MOCK_PRODUCTS.length === initialLength) {
        reject(new Error('Product not found'));
        return;
      }
      
      resolve();
    }, 800);
  });
};