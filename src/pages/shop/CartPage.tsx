import React from 'react';
import { Link } from 'react-router-dom';
import { Trash, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useShop } from '../../context/ShopContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link to="/shop">
              <Button variant="primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Cart items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product.id} className="p-6 flex flex-col sm:flex-row">
                    <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-md"
                      />
                    </div>
                    <div className="sm:ml-6 sm:flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            <Link to={`/product/${item.product.id}`} className="hover:text-indigo-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.product.variants.map((variant, index) => (
                              <span key={variant.name} className="mr-2">
                                {variant.name}: {variant.options.join(', ')}
                                {index < item.product.variants.length - 1 ? ' | ' : ''}
                              </span>
                            ))}
                          </p>
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-indigo-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Continue shopping */}
            <div className="mt-6">
              <Link to="/shop" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">${cartTotal.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">$0.00</p>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <p className="text-gray-600">Tax</p>
                <p className="text-gray-900 font-medium">$0.00</p>
              </div>
              
              <div className="flex justify-between py-4 font-medium">
                <p className="text-gray-900">Total</p>
                <p className="text-indigo-600 text-xl">${cartTotal.toFixed(2)}</p>
              </div>
              
              <div className="mt-6">
                <Link to="/checkout">
                  <Button variant="primary" size="lg" fullWidth>
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;