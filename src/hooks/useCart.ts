import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, Lock, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Product } from '../../types';
import { sendOrderNotification } from '../../utils/orderNotifications';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe('pk_live_51STuwTDnRGGY8UdiPeyjnL7TIOi5sTRLgrvJW3eM33IvQD5R5Ba8d6ktSs1HQZAX4MQLJH2C2Q4mJJKVOsRLQnQs00ZCoQs2DQ');

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const buildOrderData = (
  orderId: string,
  grandTotal: number,
  total: number,
  shipping: number,
  items: CartItem[],
  formData: any
) => ({
  orderId,
  total: grandTotal,
  subtotal: total,
  shipping,
  items: items.map(item => ({
    id: item.product.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  })),
  customer: {
    name: formData.name,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    postalCode: formData.postalCode,
    country: formData.country,
    deliveryMethod: formData.deliveryMethod,
  },
  timestamp: new Date().toISOString(),
});

const createPaymentIntent = async (grandTotal: number, formData: any, items: CartItem[]) => {
  const res = await fetch('/.netlify/functions/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: grandTotal,
      currency: 'nzd',
      metadata: {
        customer_name: formData.name,
        customer_email: formData.email,
        items: items.map(i => `${i.product.name} x${i.quantity}`).join(', '),
      },
    }),
  });
  return res.json();
};

// ─── Apple Pay / Google Pay Button ────────────────────────────────────────────

interface ExpressPayProps {
  grandTotal: number;
  formData: any;
  items: CartItem[];
  shipping: number;
  total: number;
  onSuccess: (orderId: string) => void;
  onError: (msg: string) => void;
}

const ExpressPayButton: React.FC<ExpressPayProps> = ({
  grandTotal, formData, items, shipping, total, onSuccess, onError,
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: 'NZ',
      currency: 'nzd',
      total: { label: "Poppa's Wooden Creations", amount: Math.round(grandTotal * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.canMakePayment().then(result => {
      if (result) { setPaymentRequest(pr); setCanPay(true); }
    });
    pr.on('paymentmethod', async (ev) => {
      try {
        const { clientSecret, error: backendError } = await createPaymentIntent(grandTotal, formData, items);
        if (backendError) { ev.complete('fail'); onError(backendError); return; }
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret, { payment_method: ev.paymentMethod.id }, { handleActions: false }
        );
        if (error) { ev.complete('fail'); onError(error.message || 'Payment failed'); return; }
        ev.complete('success');
        if (paymentIntent?.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
          if (actionError) { onError(actionError.message || 'Payment failed'); return; }
        }
        const orderId = `STR-${paymentIntent!.id.slice(-8).toUpperCase()}`;
        localStorage.setItem('pending-order', JSON.stringify(buildOrderData(orderId, grandTotal, total, shipping, items, {
          ...formData,
          name: ev.payerName || formData.name,
          email: ev.payerEmail || formData.email,
        })));
        await sendOrderNotification({
          orderTotal: grandTotal, items, customer: formData,
          paymentMethod: 'Apple/Google Pay', orderNumber: orderId,
        }).catch(console.error);
        if (window.gtag) window.gtag('event', 'purchase', { transaction_id: orderId, value: grandTotal, currency: 'NZD' });
        onSuccess(orderId);
      } catch (err: any) { ev.complete('fail'); onError(err.message || 'Something went wrong'); }
    });
  }, [stripe, grandTotal]);

  if (!canPay || !paymentRequest) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Smartphone size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Express Checkout</span>
      </div>
      <PaymentRequestButtonElement options={{ paymentRequest, style: { paymentRequestButton: { type: 'buy', theme: 'dark', height: '52px' } } }} />
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 text-sm text-gray-400">or pay by card</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
    </div>
  );
};

// ─── Stripe Card Form ─────────────────────────────────────────────────────────

interface StripeFormProps {
  grandTotal: number;
  formData: any;
  items: CartItem[];
  shipping: number;
  total: number;
  onSuccess: (orderId: string) => void;
  onError: (msg: string) => void;
}

const StripeCardForm: React.FC<StripeFormProps> = ({
  grandTotal, formData, items, shipping, total, onSuccess, onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleStripeSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { clientSecret, error: backendError } = await createPaymentIntent(grandTotal, formData, items);
      if (backendError) { onError(backendError); setProcessing(false); return; }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name, email: formData.email,
            address: { line1: formData.address, city: formData.city, postal_code: formData.postalCode, country: formData.country },
          },
        },
      });
      if (error) { onError(error.message || 'Payment failed'); setProcessing(false); return; }
      if (paymentIntent?.status === 'succeeded') {
        const orderId = `STR-${paymentIntent.id.slice(-8).toUpperCase()}`;
        localStorage.setItem('pending-order', JSON.stringify(buildOrderData(orderId, grandTotal, total, shipping, items, formData)));
        await sendOrderNotification({
          orderTotal: grandTotal, items, customer: formData,
          paymentMethod: 'Stripe', orderNumber: orderId,
        }).catch(console.error);
        if (window.gtag) window.gtag('event', 'purchase', { transaction_id: orderId, value: grandTotal, currency: 'NZD' });
        onSuccess(orderId);
      }
    } catch (err: any) { onError(err.message || 'Something went wrong'); setProcessing(false); }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9CA3AF' } }, invalid: { color: '#EF4444' } } }} />
      </div>
      <button onClick={handleStripeSubmit} disabled={processing || !stripe}
        className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
        <CreditCard size={20} />
        <span>{processing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)} NZD by Card`}</span>
      </button>
    </div>
  );
};

const StripePaymentSection: React.FC<StripeFormProps> = (props) => (
  <Elements stripe={stripePromise}>
    <ExpressPayButton {...props} />
    <StripeCardForm {...props} />
  </Elements>
);

// ─── Main Cart Component ──────────────────────────────────────────────────────

const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [formData, setFormData] = useState({
    email: '', name: '', address: '', city: '', postalCode: '', country: 'NZ', deliveryMethod: 'shipping',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.product.weight || 0.5) * item.quantity, 0);
  const shipping = calculateShipping();
  const grandTotal = total + shipping;

  function calculateShipping() {
    if (formData.deliveryMethod === 'pickup') return 0;
    const hasPineCars = items.some(item =>
      item.product.price === 5.0 &&
      (item.product.name.toLowerCase().includes('pine') || item.product.name.toLowerCase().includes('car') ||
       item.product.name.toLowerCase().includes('ute') || item.product.name.toLowerCase().includes('small'))
    );
    if (hasPineCars) return 0;
    if (total >= 1000) return 0;
    switch (formData.country) {
      case 'NZ': return totalWeight <= 1 ? 8.5 : totalWeight <= 2 ? 12 : totalWeight <= 3 ? 18 : totalWeight <= 4 ? 25 : 30;
      case 'AU': return totalWeight <= 1 ? 25 : 35;
      case 'US': case 'CA': return totalWeight <= 1 ? 35 : 50;
      case 'GB': return totalWeight <= 1 ? 40 : 55;
      default: return totalWeight <= 1 ? 50 : 70;
    }
  }

  const validateForm = () => {
    if (!formData.email || !formData.name) { setError('Please fill in all required fields'); return false; }
    if (formData.deliveryMethod === 'shipping' && (!formData.address || !formData.city || !formData.postalCode)) {
      setError('Please fill in shipping address'); return false;
    }
    return true;
  };

  const calculateDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + (formData.country === 'NZ' ? 7 : 14));
    return date.toISOString().split('T')[0];
  };

  const handlePayPalRedirect = () => {
    if (!validateForm()) return;
    const orderId = `PAY-${Date.now()}`;
    localStorage.setItem('pending-order', JSON.stringify(buildOrderData(orderId, grandTotal, total, shipping, items, formData)));
    sendOrderNotification({ orderTotal: grandTotal, items, customer: formData, paymentMethod: 'PayPal', orderNumber: orderId }).catch(console.error);
    const returnUrl = encodeURIComponent(`${window.location.origin}/order-confirmation?order_id=${orderId}&email=${encodeURIComponent(formData.email)}&delivery_date=${calculateDeliveryDate()}&source=paypal`);
    const cancelUrl = encodeURIComponent(window.location.origin);
    const itemName = encodeURIComponent(`Wooden Toys Order - ${items.length} item${items.length !== 1 ? 's' : ''}`);
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=poppas.wooden.creations@gmail.com&item_name=${itemName}&amount=${grandTotal.toFixed(2)}&currency_code=NZD&return=${returnUrl}&cancel_return=${cancelUrl}&rm=2&cbt=Return%20to%20Poppa%27s%20Wooden%20Creations&no_note=1`;
    try {
      const newWindow = window.open(paypalUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = paypalUrl;
      } else {
        onClearCart();
        localStorage.removeItem('poppas-cart');
        onClose();
      }
    } catch { window.location.href = paypalUrl; }
  };

  const handleStripeSuccess = (orderId: string) => {
    onClearCart();
    localStorage.removeItem('poppas-cart');
    setCompletedOrderId(orderId);
    setOrderComplete(true);
    window.location.href = `/order-confirmation?order_id=${orderId}&email=${encodeURIComponent(formData.email)}&delivery_date=${calculateDeliveryDate()}&source=stripe`;
  };

  // ─── Order Complete ─────────────────────────────────────────────────────────
  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Order #{completedOrderId}</p>
          <p className="text-gray-500 mb-6">A confirmation email will be sent to {formData.email}</p>
          <button onClick={onClose} className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700">Continue Shopping</button>
        </div>
      </div>
    );
  }

  // ─── Checkout ───────────────────────────────────────────────────────────────
  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen flex items-start justify-center p-4">
          <div className="bg-white w-full max-w-2xl my-8 rounded-xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button onClick={() => { setShowCheckout(false); setError(''); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-red-500 mt-0.5" size={20} />
                  <div className="text-sm text-red-800"><p className="font-medium">Error</p><p>{error}</p></div>
                </div>
              )}

              {/* ORDER SUMMARY */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm">
                      <span>{formData.deliveryMethod === 'pickup' ? 'Pickup:' : `Shipping (${totalWeight.toFixed(1)}kg to ${formData.country}):`}</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-bold"><span>Total:</span><span>${grandTotal.toFixed(2)} NZD</span></div>
                  </div>
                </div>
              </div>

              {/* DELIVERY METHOD */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, deliveryMethod: 'shipping' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${formData.deliveryMethod === 'shipping' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <div className="flex items-center justify-center space-x-2 text-blue-800"><span className="text-2xl">📦</span><span className="font-bold">Ship to Me</span></div>
                    <p className="text-sm text-gray-600 mt-2">Delivered to your address</p>
                    <p className="text-xs text-gray-600 mt-1">Shipping: {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)} NZD`}</p>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${formData.deliveryMethod === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <div className="flex items-center justify-center space-x-2 text-green-800"><span className="text-2xl">🏪</span><span className="font-bold">FREE Pickup</span></div>
                    <p className="text-sm text-gray-600 mt-2">Pickup from our workshop</p>
                    <p className="text-xs text-gray-600 mt-1">102 Kiripaka Rd, Whangarei (by appointment)</p>
                  </button>
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-4">
                  <input type="email" placeholder="Email address *" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  <input type="text" placeholder="Full name *" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>

              {/* SHIPPING ADDRESS */}
              {formData.deliveryMethod === 'shipping' && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Street address *" value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City *" value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      <input type="text" placeholder="Postal code *" value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    </div>
                    <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option value="NZ">New Zealand</option>
                      <option value="AU">Australia</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PICKUP INFO */}
              {formData.deliveryMethod === 'pickup' && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3">🏪 Workshop Pickup Details</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Address:</strong> 102 Kiripaka Rd, Whangarei, New Zealand</p>
                    <p><strong>Hours:</strong> Monday–Friday 9AM–5PM, Saturday 10AM–2PM</p>
                    <p><strong>Contact:</strong> 021 022 8166</p>
                    <p><strong>Note:</strong> Please call ahead to arrange pickup time</p>
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD TABS */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button type="button" onClick={() => setPaymentMethod('stripe')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${paymentMethod === 'stripe' ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    <CreditCard size={18} />
                    <span>Card / Apple / Google</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span>PayPal</span>
                  </button>
                </div>

                {paymentMethod === 'stripe' && (
                  <div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
                      <p className="text-amber-800 text-sm">💳 Pay by Apple Pay, Google Pay, or credit/debit card. No account needed.</p>
                    </div>
                    <StripePaymentSection grandTotal={grandTotal} formData={formData} items={items} shipping={shipping} total={total} onSuccess={handleStripeSuccess} onError={msg => setError(msg)} />
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div>
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-blue-800 text-sm">Pay with PayPal. No PayPal account needed — pay as a guest with any card.</p>
                    </div>
                    <button onClick={handlePayPalRedirect} disabled={processing}
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">PP</span>
                      </div>
                      <span>Pay ${grandTotal.toFixed(2)} NZD with PayPal</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <p className="font-bold text-green-800 flex items-center justify-center space-x-2">
                  <Lock size={16} />
                  <span>Secure Payment — SSL Encrypted</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Cart Sidebar ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-end p-2 sm:p-4">
        <div className="bg-white w-full max-w-sm sm:max-w-md h-full max-h-screen overflow-y-auto rounded-l-xl shadow-2xl">
          <div className="bg-amber-600 text-white p-2 text-center font-bold">🛒 Shopping Cart</div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-amber-600" size={24} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Cart ({items.length})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some beautiful wooden toys to get started!</p>
                <button onClick={onClose} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors">Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0">
                        <img src={item.product.images[0] || '/FB_IMG_1640827671355.jpg'} alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={e => { (e.target as HTMLImageElement).src = '/FB_IMG_1640827671355.jpg'; }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{item.product.name}</h3>
                        <p className="text-amber-600 font-semibold text-sm sm:text-base">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Minus size={16} /></button>
                        <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Plus size={16} /></button>
                      </div>
                      <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-amber-600">${total.toFixed(2)} NZD</span>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => setShowCheckout(true)} className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                      Proceed to Checkout
                    </button>
                    <button onClick={() => { onClearCart(); localStorage.removeItem('poppas-cart'); }} className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
