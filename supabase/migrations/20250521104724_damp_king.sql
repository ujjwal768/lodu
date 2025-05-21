/*
  # Initial database schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Supabase Auth user ID
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text) - Either 'buyer' or 'seller'
      - `store_name` (text, optional) - For sellers only
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `seller_id` (uuid) - References users.id
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `images` (text[])
      - `category` (text)
      - `inventory` (integer)
      - `variants` (jsonb)
      - `featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `seller_id` (uuid) - References users.id
      - `buyer_id` (uuid) - References users.id
      - `items` (jsonb)
      - `total` (numeric)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'seller')),
  store_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  images text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  inventory integer NOT NULL DEFAULT 0 CHECK (inventory >= 0),
  variants jsonb NOT NULL DEFAULT '[]',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users(id) NOT NULL,
  buyer_id uuid REFERENCES users(id) NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can manage their products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);

-- Orders policies
CREATE POLICY "Buyers can view their orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders for their products"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update their orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();