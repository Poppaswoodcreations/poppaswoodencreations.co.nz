import React, { useState, useEffect } from 'react';
import { Package, Mail, Phone, MapPin, Clock, CheckCircle, AlertTriangle, Trash2, Eye } from 'lucide-react';

interface PendingOrder {
  orderNumber: string;
  orderTotal: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  notified: boolean;
}

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Load orders from localStorage
  useEffect(() => {
    loadOrders();
    
    // Set up periodic checking for new orders
    const interval = setInterval(loadOrders, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem('pending-orders');
      if (stored) {
        const parsedOrders = JSON.parse(stored);
        setOrders(parsedOrders);
        console.log(`📦 Loaded ${parsedOrders.length} orders from storage`);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = (orderNumber: string, status: PendingOrder['status']) => {
    const updatedOrders = orders.map(order => 
      order.orderNumber === orderNumber 
        ? { ...order, status, notified: true }
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('pending-orders', JSON.stringify(updatedOrders));
    
    console.log(`📦 Updated order ${orderNumber} status to ${status}`);
  };

  const deleteOrder = (orderNumber: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.orderNumber !== orderNumber);
      setOrders(updatedOrders);
      localStorage.setItem('pending-orders', JSON.stringify(updatedOrders));
    }
  };

  const markAsNotified = (orderNumber: string) => {
    const updatedOrders = orders.map(order => 
      order.orderNumber === orderNumber 
        ? { ...order, notified: true }
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('pending-orders', JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Order Management</h3>
        <button
          onClick={loadOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Package size={16} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{pendingOrdersCount}</div>
              <div className="text-gray-600">Pending Orders</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Setup */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h4 className="font-semibold text-amber-800 mb-3">📧 Order Notification Setup</h4>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>✅ Email Notifications ACTIVE!</strong></p>
          <p><strong>Admin Email:</strong> adrianbarber8@gmail.com</p>
          <p><strong>How it works:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Customer places order → Automatic email sent to adrianbarber8@gmail.com</li>
            <li>Order stored in Admin Dashboard for tracking</li>
            <li>Browser notification shown (if enabled)</li>
            <li>Backup mailto link opens if email service fails</li>
          </ol>
          <p className="mt-3 font-medium">
            📱 <strong>Multiple backup methods ensure you never miss an order!</strong>
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Recent Orders</h4>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderNumber} className={`hover:bg-gray-50 ${!order.notified ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {!order.notified && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.orderTotal.toFixed(2)} NZD</div>
                      <div className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value as PendingOrder['status'])}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => markAsNotified(order.orderNumber)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Mark as notified"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.orderNumber)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-gray-900 ml-2">${selectedOrder.orderTotal.toFixed(2)} NZD</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium text-gray-900 ml-2">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900 ml-2">{formatDate(selectedOrder.timestamp)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium text-gray-900 ml-2">{selectedOrder.items.length}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="mr-2 text-blue-600" size={16} />
                  Customer Information
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedOrder.customer.name}</div>
                  <div><strong>Email:</strong> 
                    <a href={`mailto:${selectedOrder.customer.email}`} className="text-blue-600 hover:underline ml-1">
                      {selectedOrder.customer.email}
                    </a>
                  </div>
                  <div><strong>Address:</strong> {selectedOrder.customer.address}</div>
                  <div><strong>City:</strong> {selectedOrder.customer.city}, {selectedOrder.customer.postalCode}</div>
                  <div><strong>Country:</strong> {selectedOrder.customer.country}</div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${selectedOrder.customer.email}?subject=Order Confirmation - ${selectedOrder.orderNumber}&body=Hi ${selectedOrder.customer.name},%0D%0A%0D%0AThank you for your order! We've received your order and will process it shortly.%0D%0A%0D%0AOrder Number: ${selectedOrder.orderNumber}%0D%0ATotal: $${selectedOrder.orderTotal.toFixed(2)} NZD%0D%0A%0D%0ABest regards,%0D%0APoppa's Wooden Creations`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Mail size={14} />
                  <span>Email Customer</span>
                </a>
                
                <button
                  onClick={() => updateOrderStatus(selectedOrder.orderNumber, 'processing')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  Mark Processing
                </button>
                
                <button
                  onClick={() => updateOrderStatus(selectedOrder.orderNumber, 'shipped')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Mark Shipped
                </button>
                
                <button
                  onClick={() => markAsNotified(selectedOrder.orderNumber)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Mark Notified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 How Order Notifications Work</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Current Setup:</strong> Orders are stored in your browser's local storage</p>
          <p><strong>Red dot:</strong> Indicates new/unnotified orders</p>
          <p><strong>Email Customer:</strong> Opens your email client with pre-filled order confirmation</p>
          <p><strong>Status Updates:</strong> Track order progress from pending to completed</p>
          <p><strong>Refresh Orders:</strong> Check for new orders manually</p>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;