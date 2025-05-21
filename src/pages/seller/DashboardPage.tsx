import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, CreditCard, BarChart2, TrendingUp, TrendingDown, Users } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { getSellerProducts } from '../../services/productService';
import { getSellerOrders } from '../../services/orderService';
import { Product } from '../../types/product';
import { Order, OrderStatus } from '../../types/order';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedOrders] = await Promise.all([
          getSellerProducts(user.id),
          getSellerOrders(user.id),
        ]);

        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.inventory > 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PROCESSING).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  // Mock data for the sales chart
  const salesData = [5200, 4800, 6000, 5400, 6800, 7200, 8000];
  const prevSalesData = [4800, 4200, 5600, 5000, 6200, 6800, 7500];
  
  // Calculate sales trend percentage
  const currentSales = salesData[salesData.length - 1];
  const prevSales = prevSalesData[prevSalesData.length - 1];
  const salesTrend = ((currentSales - prevSales) / prevSales) * 100;
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-gray-300 rounded-lg"></div>
            <div className="h-80 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <Link
          to="/dashboard/products/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ShoppingBag className="mr-2 -ml-1 h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-indigo-100">
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-500 bg-opacity-10">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
              <p className="text-sm text-gray-500">{activeProducts} active</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100">
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-teal-500 bg-opacity-10">
              <CreditCard className="h-8 w-8 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-teal-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{totalOrders} orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-100">
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-amber-500 bg-opacity-10">
              <ShoppingBag className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-amber-600">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
              <p className="text-sm text-gray-500">Needs attention</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border border-rose-100">
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-rose-500 bg-opacity-10">
              <Users className="h-8 w-8 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-rose-600">Customers</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
              <p className="text-sm text-gray-500">+3 this week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  salesTrend >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {salesTrend >= 0 ? (
                    <TrendingUp className="mr-1.5 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1.5 h-3 w-3" />
                  )}
                  {Math.abs(salesTrend).toFixed(1)}%
                </span>
                <span className="ml-2 text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end">
              {salesData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-indigo-200 rounded-t"
                      style={{ height: `${(value / 10000) * 200}px` }}
                    ></div>
                    <div
                      className="absolute bottom-0 w-full bg-indigo-600 rounded-t transition-all duration-300 group-hover:bg-indigo-700"
                      style={{ height: `${(value / 10000) * 200}px` }}
                    ></div>
                    <div className="absolute bottom-full w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                      <span className="text-xs font-medium text-gray-900">${value}</span>
                    </div>
                  </div>
                  <span className="mt-2 text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              <Link
                to="/dashboard/orders"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View all
              </Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`
                          px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === OrderStatus.PENDING
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === OrderStatus.PROCESSING
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === OrderStatus.SHIPPED
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === OrderStatus.DELIVERED
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;