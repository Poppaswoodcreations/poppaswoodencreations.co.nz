import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');
    const deliveryDate = searchParams.get('delivery_date');
    
    if (!orderId || !email) return;

    // Load Google Customer Reviews script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Render the opt-in survey
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
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-700 mb-6">
          Your order has been confirmed. You'll receive an email confirmation shortly.
        </p>
        <p className="text-sm text-gray-600">
          Order ID: {searchParams.get('order_id')}
        </p>
      </div>
      
      {/* Google Customer Reviews opt-in will appear below */}
      <div className="mt-8"></div>
    </div>
  );
};

export default OrderConfirmation;
