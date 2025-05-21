import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  
  // If no order ID is in the state, redirect to home
  if (!orderId) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-6">
          <CheckCircle className="h-12 w-12" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium text-gray-900">{orderId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600">Processing</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          You will receive an email confirmation shortly at your registered email address.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop">
            <Button 
              variant="primary"
              leftIcon={<ShoppingBag className="h-5 w-5" />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;