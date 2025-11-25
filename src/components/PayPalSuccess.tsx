import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';

const PayPalSuccess: React.FC = () => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Load order data from localStorage
    try {
      const stored = localStorage.getItem('paypal-order-data');
      if (stored) {
        const data = JSON.parse(stored);
        setOrderData(data);
        
        // Clear the stored data
        localStorage.removeItem('paypal-order-data');
      }
    } catch (error) {
      console.error('Error loading order data:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
        <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Payment Successful!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your order! Your PayPal payment has been processed successfully.
        </p>

        {orderData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-semibold text-gray-900">${orderData.total?.toFixed(2)} NZD</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold text-gray-900">{orderData.items?.length || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold text-gray-900">PayPal</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold text-gray-900">
                  {orderData.timestamp ? new Date(orderData.timestamp).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>

            {orderData.items && orderData.items.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Items Ordered:</h3>
                <div className="space-y-2">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
            <Package className="mr-2" size={20} />
            What Happens Next?
          </h3>
          <div className="text-sm text-blue-800 space-y-2 text-left">
            <p>✅ <strong>Order Confirmed:</strong> Your order has been received and is being processed</p>
            <p>📧 <strong>Email Notification:</strong> You'll receive a confirmation email shortly</p>
            <p>📦 <strong>Processing:</strong> We'll prepare your handcrafted wooden toys with care</p>
            <p>🚚 <strong>Shipping:</strong> Tracking information will be sent when your order ships</p>
            <p>🎯 <strong>Delivery:</strong> Your beautiful wooden toys will arrive as estimated</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">Questions about your order?</p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>poppas.wooden.creations@gmail.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>+64 21 022 8166</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalSuccess;