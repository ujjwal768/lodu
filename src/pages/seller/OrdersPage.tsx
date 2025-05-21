import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types/order';
import { getSellerOrders, updateOrderStatus } from '../../services/orderService';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const fetchedOrders = await getSellerOrders(user.id);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleSort = (column: 'date' | 'total') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update the local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
          : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      (searchTerm === '' || 
       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterStatus === '' || order.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | '')}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">
            {searchTerm || filterStatus ? 'No orders match your search criteria' : 'No orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{filteredOrders.length} orders found</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleSort('date')}
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <span>Date</span>
                {sortBy === 'date' && (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleSort('total')}
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <span>Amount</span>
                {sortBy === 'total' && (
                  sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
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
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {Object.values(OrderStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex justify-between md:justify-end md:space-x-4">
                      <span className="text-sm text-gray-500">Subtotal:</span>
                      <span className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between md:justify-end md:space-x-4">
                      <span className="text-sm text-gray-500">Shipping:</span>
                      <span className="text-sm font-medium text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between md:justify-end md:space-x-4">
                      <span className="text-sm text-gray-500">Tax:</span>
                      <span className="text-sm font-medium text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between md:justify-end md:space-x-4 pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total:</span>
                      <span className="text-sm font-bold text-indigo-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;