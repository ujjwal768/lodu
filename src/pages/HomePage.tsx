import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Package, Shield, CreditCard } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 4));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="E-commerce platform"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Create Your Dream Online Store
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Beautiful, feather-light e-commerce platform for entrepreneurs and small businesses.
              Start selling anywhere, to anyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" variant="primary">
                  Start Selling Today
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-gray-800">
                  Browse Shops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose FeatherShop?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create a successful online store in one lightweight platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Easy Setup</h3>
              <p className="text-gray-600">
                Create your online store in minutes with our intuitive dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Inventory Management</h3>
              <p className="text-gray-600">
                Easily manage your products, track inventory, and fulfill orders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Accept payments safely with our secure checkout process.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Customer Trust</h3>
              <p className="text-gray-600">
                Build trust with customers through our reliable platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/shop" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your online business?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of entrepreneurs who are growing their businesses with FeatherShop.
          </p>
          <Link to="/register">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-indigo-600">
              Create Your Store
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;