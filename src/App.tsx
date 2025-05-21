import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/seller/DashboardPage';
import ProductsPage from './pages/seller/ProductsPage';
import AddProductPage from './pages/seller/AddProductPage';
import OrdersPage from './pages/seller/OrdersPage';
import StoreSettingsPage from './pages/seller/StoreSettingsPage';
import ShopPage from './pages/shop/ShopPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderConfirmationPage from './pages/shop/OrderConfirmationPage';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ShopProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              
              {/* Seller Dashboard Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute role="seller">
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard/products" element={
                <ProtectedRoute role="seller">
                  <ProductsPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard/products/add" element={
                <ProtectedRoute role="seller">
                  <AddProductPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard/products/edit/:id" element={
                <ProtectedRoute role="seller">
                  <AddProductPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard/orders" element={
                <ProtectedRoute role="seller">
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard/settings" element={
                <ProtectedRoute role="seller">
                  <StoreSettingsPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </ShopProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;