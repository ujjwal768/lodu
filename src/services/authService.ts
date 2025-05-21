export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller';
  storeName?: string;
  createdAt: string;
}

// Mock user data - in a real app, this would be handled by a backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'seller@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'seller',
    storeName: 'John\'s Store',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'buyer@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'buyer',
    createdAt: new Date().toISOString(),
  },
];

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const registerUser = async (userData: Partial<User>, isSeller: boolean): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: isSeller ? 'seller' : 'buyer',
        storeName: isSeller ? userData.storeName : undefined,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be saved to a database
      MOCK_USERS.push(newUser);
      
      resolve(newUser);
    }, 800);
  });
};

export const logoutUser = (): void => {
  // In a real app, this might involve API calls to invalidate tokens, etc.
  console.log('User logged out');
};