import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash, Plus, Image, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Product, ProductCategory, ProductVariant } from '../../types/product';
import { addProduct, getProductById, updateProduct } from '../../services/productService';

const AddProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    images: [],
    category: ProductCategory.OTHER,
    inventory: 0,
    variants: [],
    featured: false,
  });
  
  const [newVariant, setNewVariant] = useState({
    name: '',
    options: '',
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Load product data if editing
  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        setIsLoading(true);
        try {
          const product = await getProductById(id);
          if (product) {
            setFormData(product);
          }
        } catch (error) {
          console.error('Failed to load product:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload only image files.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('Image size should be less than 5MB.');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), base64String]
          }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setUploadError('Failed to process image. Please try again.');
      }
    }

    // Clear the input
    e.target.value = '';
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !formData.images?.includes(newImageUrl)) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImageUrl],
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index),
    });
  };

  const handleAddVariant = () => {
    if (newVariant.name.trim() && newVariant.options.trim()) {
      const options = newVariant.options.split(',').map(option => option.trim());
      
      setFormData({
        ...formData,
        variants: [
          ...(formData.variants || []),
          { name: newVariant.name, options },
        ],
      });
      
      setNewVariant({ name: '', options: '' });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        sellerId: user.id,
        price: formData.price || 0,
        inventory: formData.inventory || 0,
        images: formData.images || [],
        variants: formData.variants || [],
      } as Product;
      
      if (id) {
        await updateProduct(id, productData);
      } else {
        await addProduct(productData);
      }
      
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                      Inventory
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      min="0"
                      required
                      value={formData.inventory}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {Object.values(ProductCategory).map((category) => (
                      <option key={category} value={category} className="capitalize">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Feature this product on the homepage
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Product Images</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="h-32 w-32 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {formData.images?.length === 0 && (
                    <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                      <Image className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-sm text-red-600">{uploadError}</p>
                )}
                
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images
                    </label>
                    <div className="flex items-center">
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="ml-3 text-sm text-gray-500">
                        Upload up to 5 images (max 5MB each)
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="url"
                      placeholder="Or enter image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-grow block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddImage}
                    >
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Product Variants</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.variants?.length ? (
                  <div className="space-y-4">
                    {formData.variants.map((variant: ProductVariant, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="absolute top-4 right-4 text-red-500"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                        <h3 className="font-medium text-gray-900">{variant.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {variant.options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No variants added yet.</p>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Add New Variant</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="variantName" className="block text-sm font-medium text-gray-700">
                        Variant Name (e.g., Color, Size)
                      </label>
                      <input
                        type="text"
                        id="variantName"
                        value={newVariant.name}
                        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="variantOptions" className="block text-sm font-medium text-gray-700">
                        Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="variantOptions"
                        placeholder="Red, Blue, Green"
                        value={newVariant.options}
                        onChange={(e) => setNewVariant({ ...newVariant, options: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddVariant}
                      disabled={!newVariant.name || !newVariant.options}
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Add Variant
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {id ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;