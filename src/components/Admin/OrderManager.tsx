import React, { useState, useEffect } from 'react';
import { Package, Mail, MapPin, CheckCircle, AlertTriangle, Trash2, Eye, X, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Order {
  id: string;
  order_number: string;
  order_total: number;
  subtotal: number;
  shipping: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  customer: {
    name: string;
    email: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    deliveryMethod?: string;
  };
  payment_method: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  created_at: string;
}

const ADMIN_EMAIL = 'poppas.wooden.creations@gmail.com';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      console.log(`📦 Loaded ${data?.length || 0} orders from Supabase`);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
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
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.order_total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Order Management</h3>
        <button onClick={loadOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <RefreshCw size={16} />
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
              <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
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

      {/* Notification info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">📧 Order Notifications</h4>
        <p className="text-sm text-amber-700">
          <strong>✅ Active</strong> — Every order is automatically saved here and emails sent to <strong>{ADMIN_EMAIL}</strong> and the customer via Resend.
        </p>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Recent Orders</h4>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-3">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                      <div className="text-sm text-gray-500">{order.payment_method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.order_total.toFixed(2)} NZD</div>
                      <div className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => deleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete order">
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
                <h3 className="text-xl font-bold text-gray-900">Order #{selectedOrder.order_number}</h3>
                <button onClick={() => setShowOrderDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Total:</span><span className="font-bold ml-2">${selectedOrder.order_total.toFixed(2)} NZD</span></div>
                  <div><span className="text-gray-600">Payment:</span><span className="font-medium ml-2">{selectedOrder.payment_method}</span></div>
                  <div><span className="text-gray-600">Subtotal:</span><span className="font-medium ml-2">${(selectedOrder.subtotal || 0).toFixed(2)}</span></div>
                  <div><span className="text-gray-600">Shipping:</span><span className="font-medium ml-2">{selectedOrder.shipping === 0 ? 'FREE' : `$${(selectedOrder.shipping || 0).toFixed(2)}`}</span></div>
                  <div className="col-span-2"><span className="text-gray-600">Date:</span><span className="font-medium ml-2">{formatDate(selectedOrder.created_at)}</span></div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="mr-2 text-blue-600" size={16} />Customer
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedOrder.customer.name}</div>
                  <div><strong>Email:</strong>
                    <a href={`mailto:${selectedOrder.customer.email}`} className="text-blue-600 hover:underline ml-1">
                      {selectedOrder.customer.email}
                    </a>
                  </div>
                  {selectedOrder.customer.deliveryMethod === 'pickup' ? (
                    <div><strong>Delivery:</strong> 🏪 Workshop Pickup</div>
                  ) : (
                    <>
                      <div><strong>Address:</strong> {selectedOrder.customer.address}</div>
                      <div><strong>City:</strong> {selectedOrder.customer.city}, {selectedOrder.customer.postalCode}</div>
                      <div><strong>Country:</strong> {selectedOrder.customer.country}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selectedOrder.customer.email}?subject=Your Order #${selectedOrder.order_number}&body=Hi ${selectedOrder.customer.name},%0D%0A%0D%0AThank you for your order!%0D%0A%0D%0AOrder: ${selectedOrder.order_number}%0D%0ATotal: $${selectedOrder.order_total.toFixed(2)} NZD%0D%0A%0D%0ABest regards,%0D%0AAdrian%0D%0APoppa's Wooden Creations`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2">
                  <Mail size={14} />
                  <span>Email Customer</span>
                </a>
                <button onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm">Mark Processing</button>
                <button onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">Mark Shipped</button>
                <button onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">Mark Completed</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
