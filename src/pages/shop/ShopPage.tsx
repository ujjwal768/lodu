import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import { Product, ProductCategory } from '../../types/product';
import { getProducts, getProductsByCategory } from '../../services/productService';

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const category = searchParams.get('category') as ProductCategory | null;
    if (category && Object.values(ProductCategory).includes(category as ProductCategory)) {
      setActiveCategory(category);
    } else {
      setActiveCategory('');
    }
  }, [searchParams]);

  // Load products based on selected category
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let fetchedProducts: Product[];
        
        if (activeCategory) {
          fetchedProducts = await getProductsByCategory(activeCategory);
        } else {
          fetchedProducts = await getProducts();
        }
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory]);

  // Filter products by search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (category: ProductCategory | '') => {
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setActiveCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Shop All Products</h1>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:hidden"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category filters */}
        <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={activeCategory === ''}
                  onChange={() => handleCategoryChange('')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">All Products</span>
              </label>
              
              {Object.values(ProductCategory).map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    checked={activeCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="md:col-span-3">
          <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;