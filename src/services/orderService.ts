import { Order, OrderStatus } from '../types/order';

// Mock orders data - in a real app, this would come from your backend
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    sellerId: '1',
    buyerId: '2',
    items: [
      {
        productId: '1',
        name: 'Premium T-Shirt',
        price: 24.99,
        quantity: 2,
        variant: { Size: 'M', Color: 'Black' },
      },
      {
        productId: '3',
        name: 'Ceramic Mug',
        price: 18.99,
        quantity: 1,
        variant: { Color: 'White' },
      },
    ],
    total: 68.97,
    status: OrderStatus.DELIVERED,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2023-03-15T14:30:00Z',
    updatedAt: '2023-03-20T10:15:00Z',
  },
  {
    id: '2',
    sellerId: '1',
    buyerId: '2',
    items: [
      {
        productId: '2',
        name: 'Wireless Headphones',
        price: 129.99,
        quantity: 1,
        variant: { Color: 'Black' },
      },
    ],
    total: 129.99,
    status: OrderStatus.SHIPPED,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2023-04-02T09:45:00Z',
    updatedAt: '2023-04-03T11:20:00Z',
  },
  {
    id: '3',
    sellerId: '1',
    buyerId: '2',
    items: [
      {
        productId: '4',
        name: 'Digital Camera',
        price: 899.99,
        quantity: 1,
        variant: {},
      },
    ],
    total: 899.99,
    status: OrderStatus.PROCESSING,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2023-04-10T16:20:00Z',
    updatedAt: '2023-04-10T16:20:00Z',
  },
];

export const getSellerOrders = async (sellerId: string): Promise<Order[]> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const orders = MOCK_ORDERS.filter(o => o.sellerId === sellerId);
      resolve(orders);
    }, 500);
  });
};

export const getBuyerOrders = async (buyerId: string): Promise<Order[]> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const orders = MOCK_ORDERS.filter(o => o.buyerId === buyerId);
      resolve(orders);
    }, 500);
  });
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const order = MOCK_ORDERS.find(o => o.id === id) || null;
      resolve(order);
    }, 300);
  });
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const newOrder: Order = {
        ...orderData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: now,
        updatedAt: now,
      };
      
      MOCK_ORDERS.push(newOrder);
      resolve(newOrder);
    }, 800);
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ORDERS.findIndex(o => o.id === id);
      
      if (index === -1) {
        reject(new Error('Order not found'));
        return;
      }
      
      MOCK_ORDERS[index] = { 
        ...MOCK_ORDERS[index], 
        status, 
        updatedAt: new Date().toISOString() 
      };
      
      resolve(MOCK_ORDERS[index]);
    }, 800);
  });
};