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
import PayPalButton from './PayPalButton';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe('pk_live_51STuwTDnRGGY8UdiPeyjnL7TIOi5sTRLgrvJW3eM33IvQD5R5Ba8d6ktSs1HQZAX4MQLJH2C2Q4mJJKVOsRLQnQs00ZCoQs2DQ');

// ─── NZ Rural Postcodes ───────────────────────────────────────────────────────
// Source: NZ Post Rural Delivery Directory (via sapling.co.nz, last updated Jan 2022)
const NZ_RURAL_POSTCODES = new Set([
  // North Island
  '0448','0792','0793','0794','4771','3979','4884','3078','0486','2675','0496','4894','3493','3494','3495','3496',
  '5791','5792','3581','3582','3583','3584','4971','4972','4973','4975','4976','4977','4978','4970','4979',
  '0371','0372','0373','0374','0376','0377','0370','0379','2577','2578','2579','4994','4996','4993','4995',
  '4398','4399','5771','5772','5773','4775','4777','4779','4891','4893','4071','4072','4073','0991','5794',
  '3281','3282','3283','3284','3285','3286','3287','3288','3289','3290','3293','4171','4172','4174','4175',
  '4179','4180','4178','4294','4295','4671','4672','4673','4674','4675','4678','4679','0874','0875','0781',
  '0782','3579','0181','0182','0184','2571','4781','4782','4783','4784','4785','4786','3771','3772','4386',
  '4387','4388','4389','4390','0478','0479','0474','0472','0473','0481','0482','0483','0484','0573','0185',
  '6972','3177','3178','3170','3181','0871','0873','0281','0282','0283','3889','0294','0295','0293','4774',
  '0491','0492','4188','0891','0892','5571','5574','5575','5572','5570','5573','3978','3492','4797','0494',
  '2576','4078','4787','4788','4789','5881','5882','5883','5884','5885','5886','5887','5888','5889','5890',
  '5871','5872','0593','0594','3471','3472','3473','4075','3995','0583','0587','0588','0589','2474','4376',
  '3371','3372','3373','3374','3375','3079','4181','4182','4183','4184','4186','0772','4371','4372','4373',
  '4374','4381','3793','3794','3597','4974','4198','4691','3881','3882','3883','3784','3980','0475','0476',
  '0192','4278','4279','3997','3885','3886','3197','3198','3199','4681','4682','4684','4685','5581','5582',
  '5583','4276','4277','3972','3973','3974','3975','3976','3977','3989','3990','3671','3672','3673','3674',
  '4981','4982','4983','4984','4985','4986','4987','4988','4989','4471','4472','4473','4474','4475','4476',
  '4477','4478','4479','4470','4481','2580','2582','2583','2584','2585','0571','4597','4598','3971','3970',
  '2471','2472','2473','4990','4991','4992','4291','4292','4293','5381','3880','2676','2677','2678','2679',
  '3481','3482','3483','4694','4696','3295','3296','3297','4189','3081','3083','4780','3077','3072','3073',
  '3074','3076','3096','3097','4081','4082','4083','0591','0592','0272','0994','0992','0993','4391','4392',
  '4393','4394','4395','4396','4397','4791','4792','4793','4794','4795','4796','4286','4287','4288','0381',
  '3991','3992','3993','3994','3996','3791','3792','3377','3378','3379','3384','3385','3171','3172','3173',
  '3174','3175','3176','3179','3180','3391','3392','3393','3879','3872','3873','3874','3875','3876','3877',
  '3878','4091','4092','4093','4094','3781','3782','0391','3981','3982','3983','3985','3986','3987','3988',
  '3894','3895','3182','3183','3186','3187','3188','3189','3578','3577','3574','3575','3576','4087','4086',
  '5894','3484','3485','4079','3491','4077','2696','2697','2693','2694','2695','3381','3382','5371','5372',
  '4377','4375','4379','4378','3474','1971','3681','3682','5391','3196','0881','0882','0883','3998','5373',
  '0193','4271','4272','4273','4274','4275','0582','4281','4282','4283','4284','4285','4191','4197','4193',
  '4195','4196','4382','4383','3380','2681','2682','2683','2684','3475','4571','4572','4573','4574','4575',
  '4576','4577','4578','4581','4582','4584','4585','4586','4587','4588','0981','0982','0983','0984','0985',
  '0986','4591','4592','0972','0973','0974','0975','0977','3191','3192','3193','3194','3691','0171','0172',
  '0173','0174','0175','0176','0178','0179','0170','3591','3592','4997','4998','4999',
  // South Island
  '7581','7582','7583','9391','9392','9393','7481','7482','7483','7771','7772','7773','7774','7775','7776',
  '7777','7778','9271','9272','9273','9274','9779','7670','7871','7271','7272','7273','7274','7275','7276',
  '9091','7091','7984','7381','7382','7383','7384','7671','7672','7674','7675','7676','7677','7678','9583',
  '9584','7673','7073','9384','9383','7391','7392','7571','7572','9791','7872','9076','9077','7987','7193',
  '7991','7992','9372','9771','9772','9773','9774','9775','9776','9777','7387','7884','7178','7385','7881',
  '7882','7883','9871','9872','9874','9875','9876','9879','9877','7691','7692','7371','7374','7373','9281',
  '9282','7893','7875','9498','9591','9593','7682','7683','7591','9792','9793','9794','8971','5781','5782',
  '5783','5784','7791','9596','9597','9598','9291','9292','9092','7196','7197','7198','7077','7071','7072',
  '9491','9492','9494','9495','9493','9376','9377','9689','9682','9683','9386','9387','9073','9074','9585',
  '9586','7495','9481','9482','9483','7990','7281','7282','7284','7982','7983','9081','9082','9371','7194',
  '7192','7195','7781','7782','7783','7784','9395','9396','9397','9398','7471','7472','7473','7475','7476',
  '7477','7895','7081','9881','9883','7885','7379','9571','9572','7873','7285','7580','7681','7988','7183',
  '7182','9587','9679','9672','7985','7986','7971','7972','7973','7974','7975','9884','9691','7173','7175',
  '7395','9778','7491','9471','9472','7977','7978','7979','7980','9085','7095','7096','9382','7891','7892',
  '7886','9781','9782','9783','9891','9892','9893',
]);

const RURAL_SURCHARGE = 5.70;

function isRuralPostcode(postcode: string): boolean {
  return NZ_RURAL_POSTCODES.has(postcode.trim());
}

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
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [formData, setFormData] = useState({
    email: '', name: '', address: '', city: '', postalCode: '', country: 'NZ', deliveryMethod: 'shipping',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paypalOrderId] = useState(`PAY-${Date.now()}`);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.product.weight || 0.5) * item.quantity, 0);

  const isRural = formData.country === 'NZ' && formData.deliveryMethod === 'shipping' && isRuralPostcode(formData.postalCode);
  const ruralSurcharge = isRural ? RURAL_SURCHARGE : 0;
  const baseShipping = calculateBaseShipping();
  const shipping = baseShipping + ruralSurcharge;
  const grandTotal = total + shipping;

  function calculateBaseShipping() {
    if (formData.deliveryMethod === 'pickup') return 0;
    const hasPineCars = items.some(item =>
      item.product.price === 5.0 &&
      (item.product.name.toLowerCase().includes('pine') || item.product.name.toLowerCase().includes('car') ||
       item.product.name.toLowerCase().includes('ute') || item.product.name.toLowerCase().includes('small'))
    );
    if (hasPineCars) return 0;
    if (total >= 1000) return 0;
    switch (formData.country) {
      case 'NZ': return totalWeight <= 1 ? 10 : totalWeight <= 2 ? 13 : totalWeight <= 3 ? 19 : totalWeight <= 4 ? 26 : 32;
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
    setError('');
    return true;
  };

  const calculateDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + (formData.country === 'NZ' ? 7 : 14));
    return date.toISOString().split('T')[0];
  };

  const handleStripeSuccess = (orderId: string) => {
    onClearCart();
    localStorage.removeItem('poppas-cart');
    setCompletedOrderId(orderId);
    setOrderComplete(true);
    window.location.href = `/order-confirmation?order_id=${orderId}&email=${encodeURIComponent(formData.email)}&delivery_date=${calculateDeliveryDate()}&source=stripe`;
  };

  const handlePayPalSuccess = () => {
    localStorage.setItem('pending-order', JSON.stringify(buildOrderData(paypalOrderId, grandTotal, total, shipping, items, formData)));
    sendOrderNotification({ orderTotal: grandTotal, items, customer: formData, paymentMethod: 'PayPal', orderNumber: paypalOrderId }).catch(console.error);
    if (window.gtag) window.gtag('event', 'purchase', { transaction_id: paypalOrderId, value: grandTotal, currency: 'NZD' });
    onClearCart();
    localStorage.removeItem('poppas-cart');
    window.location.href = `/order-confirmation?order_id=${paypalOrderId}&email=${encodeURIComponent(formData.email)}&delivery_date=${calculateDeliveryDate()}&source=paypal`;
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
                      <span>{baseShipping === 0 ? 'FREE' : `$${baseShipping.toFixed(2)}`}</span>
                    </div>
                    {isRural && (
                      <div className="flex justify-between text-sm text-orange-700">
                        <span>Rural delivery surcharge:</span>
                        <span>$5.70</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-1"><span>Total:</span><span>${grandTotal.toFixed(2)} NZD</span></div>
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
                      <input
                        type="text"
                        placeholder="Postal code *"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                          isRural ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {isRural && (
                      <div className="flex items-start space-x-2 bg-orange-50 border border-orange-300 rounded-lg p-3">
                        <span className="text-orange-500 text-lg leading-none">🚐</span>
                        <p className="text-sm text-orange-800">
                          <strong>Rural delivery detected</strong> — NZ Post charges an additional $5.70 for rural addresses. This has been added to your order total.
                        </p>
                      </div>
                    )}
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

                {/* STRIPE */}
                {paymentMethod === 'stripe' && (
                  <div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
                      <p className="text-amber-800 text-sm">💳 Pay by Apple Pay, Google Pay, or credit/debit card. No account needed.</p>
                    </div>
                    <StripePaymentSection
                      grandTotal={grandTotal} formData={formData} items={items}
                      shipping={shipping} total={total}
                      onSuccess={handleStripeSuccess} onError={msg => setError(msg)}
                    />
                  </div>
                )}

                {/* PAYPAL */}
                {paymentMethod === 'paypal' && (
                  <div>
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-blue-800 text-sm">Pay with PayPal. No PayPal account needed — pay as a guest with any card.</p>
                    </div>
                    {(!formData.email || !formData.name) && (
                      <p className="text-amber-600 text-sm mb-3">⚠️ Please fill in your name and email above before paying with PayPal.</p>
                    )}
                    <PayPalButton
                      grandTotal={grandTotal}
                      orderId={paypalOrderId}
                      customerEmail={formData.email}
                      deliveryDate={calculateDeliveryDate()}
                      onSuccess={handlePayPalSuccess}
                      onError={msg => setError(msg)}
                    />
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
