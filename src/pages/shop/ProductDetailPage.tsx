import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Product, ProductVariant } from '../../types/product';
import { getProductById } from '../../services/productService';
import { useShop } from '../../context/ShopContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Initialize selected variants with first option of each variant
        if (productData?.variants.length) {
          const initialVariants: Record<string, string> = {};
          productData.variants.forEach((variant: ProductVariant) => {
            if (variant.options.length > 0) {
              initialVariants[variant.name] = variant.options[0];
            }
          });
          setSelectedVariants(initialVariants);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Show a confirmation message or redirect to cart
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="h-24 bg-gray-300 rounded mb-6"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop">
            <Button variant="primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/shop" className="ml-2 text-gray-500 hover:text-gray-700">Shop</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-gray-900 font-medium">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`
                    p-1 rounded-md overflow-hidden
                    ${activeImage === idx ? 'ring-2 ring-indigo-500' : 'hover:opacity-75'}
                  `}
                >
                  <img src={image} alt="" className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-indigo-600 font-semibold mt-2">${product.price.toFixed(2)}</p>
          
          <div className="mt-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6">
              {product.variants.map((variant) => (
                <div key={variant.name} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900">{variant.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleVariantChange(variant.name, option)}
                        className={`
                          px-3 py-1 border rounded-md text-sm font-medium
                          ${selectedVariants[variant.name] === option
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="mt-1 flex rounded-md">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Add to cart button */}
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShoppingCart className="h-5 w-5" />}
            >
              Add to Cart
            </Button>
          </div>

          {/* Additional product info */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>Category: <span className="capitalize">{product.category}</span></p>
              <p>
                Availability: 
                <span className={product.inventory > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.inventory > 0 ? ' In Stock' : ' Out of Stock'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;