import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');
    const deliveryDate = searchParams.get('delivery_date');
    
    if (!orderId || !email) return;

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    (window as any).renderOptIn = function() {
      (window as any).gapi.load('surveyoptin', function() {
        (window as any).gapi.surveyoptin.render({
          "merchant_id": 5719804723,
          "order_id": orderId,
          "email": email,
          "delivery_country": "NZ",
          "estimated_delivery_date": deliveryDate || calculateDeliveryDate(),
        });
      });
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [searchParams]);

  const calculateDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Thank You for Your Order!</h1>
            <p className="text-green-50 text-lg">Your payment has been received</p>
          </div>

          <div className="p-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Confirmation</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-semibold text-gray-900">{searchParams.get('order_id')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{searchParams.get('email')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-semibold text-gray-900">{searchParams.get('delivery_date') || calculateDeliveryDate()}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Confirmation Email</h3>
                    <p className="text-gray-600 text-sm">You will receive a confirmation email within the next few minutes.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Handcrafting Your Order</h3>
                    <p className="text-gray-600 text-sm">We will begin crafting your wooden toys with care and precision in our Whangarei workshop.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Notification</h3>
                    <p className="text-gray-600 text-sm">We will send you tracking information once your order ships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div id="google-customer-reviews-container"></div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Questions About Your Order?</h3>
              <p className="text-gray-700 text-sm mb-3">We are here to help! Contact us anytime:</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">Email: poppas.wooden.creations@gmail.com</p>
                <p className="text-gray-700">Phone: 021 022 8166</p>
              </div>
            </div>

            <div className="text-center">
              <a href="/" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">Continue Shopping</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
