import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { sendOrderNotification } from '../../utils/orderNotifications';

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
}

const Cart: React.FC<CartProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'NZ',
    deliveryMethod: 'shipping', // 'shipping' or 'pickup'
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [testMode, setTestMode] = useState(false); // Disable test mode - use live payments

  // Calculate totals
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalWeight = items.reduce((sum, item) => sum + ((item.product.weight || 0.5) * item.quantity), 0);
  const shipping = calculateShipping();
  const grandTotal = total + shipping;

  // Handle checkout
  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setError('');
    setSuccess(false);
  };

  // Validate PayPal form
  const validatePayPalForm = () => {
    if (!formData.email || !formData.name || !formData.address || !formData.city || !formData.postalCode) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  // Handle Stripe payment
  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      if (testMode) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Send order notification email
        await sendOrderNotification({
          orderTotal: grandTotal,
          items: items,
          customer: formData,
          paymentMethod: 'Credit Card (Test)',
          orderNumber: `TEST-${Date.now()}`
        });
        
        // Show immediate confirmation
        alert(`✅ ORDER PLACED!\n\nTotal: $${grandTotal.toFixed(2)} NZD\nCustomer: ${formData.name}\n\n📧 Email notification sent to adrianbarber8@gmail.com`);
        
        setSuccess(true);
        setTimeout(() => {
          items.forEach(item => onRemoveItem(item.product.id));
          handleCloseCheckout();
          onClose();
        }, 2000);
      } else {
        // Real Stripe integration would go here
        throw new Error('Live Stripe payments not implemented yet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  // Simple PayPal redirect approach
  const handlePayPalRedirect = () => {
    console.log('🚀 PAYPAL: Starting direct PayPal redirect');
    console.log('💰 PAYPAL: Current cart items:', items.map(item => `${item.product.name} x${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`));
    console.log('💰 PAYPAL: Cart total:', total.toFixed(2), 'NZD');
    console.log('💰 PAYPAL: Shipping:', shipping.toFixed(2), 'NZD');
    console.log('💰 PAYPAL: Grand total:', grandTotal.toFixed(2), 'NZD');
    
    // EMERGENCY: Log the exact product being used
    if (items.length > 0) {
      const firstItem = items[0];
      console.log('🔍 PAYPAL: First cart item details:');
      console.log('  - Name:', firstItem.product.name);
      console.log('  - ID:', firstItem.product.id);
      console.log('  - Price:', firstItem.product.price);
      console.log('  - Quantity:', firstItem.quantity);
      console.log('  - Line total:', (firstItem.product.price * firstItem.quantity).toFixed(2));
    }
    
    // Store order data for success page
    const orderData = {
      total: grandTotal,
      subtotal: total,
      shipping: shipping,
      items: items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      customer: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('paypal-order-data', JSON.stringify(orderData));
    
    // Send order notification for PayPal orders too
    sendOrderNotification({
      orderTotal: grandTotal,
      items: items,
      customer: formData,
      paymentMethod: 'PayPal',
      orderNumber: `PAY-${Date.now()}`
    }).catch(error => {
      console.error('Failed to send order notification:', error);
    });
    
    // Create PayPal payment URL with proper encoding
    const returnUrl = encodeURIComponent(`${window.location.origin}/#/paypal-success`);
    const cancelUrl = encodeURIComponent(window.location.origin);
    const itemName = encodeURIComponent(`Wooden Toys Order - ${items.length} item${items.length !== 1 ? 's' : ''} - Subtotal: $${total.toFixed(2)} + Shipping: $${shipping.toFixed(2)} = Total: $${grandTotal.toFixed(2)} NZD`);
    // Use _xclick for single payment with itemized breakdown
    console.log('🔗 PAYPAL: Sending amount:', total.toFixed(2));
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?` +
      `cmd=_xclick&` +
      `business=your-paypal-email@example.com&` +
      `item_name=${itemName}&` +
      `amount=${grandTotal.toFixed(2)}&` +
      `currency_code=NZD&` +
      `return=${returnUrl}&` +
      `cancel_return=${cancelUrl}&` +
      `rm=2&` +
      `cbt=Return%20to%20Poppa%27s%20Wooden%20Creations&` +
      `no_note=1&` +
      `notify_url=${encodeURIComponent(window.location.origin)}/paypal-ipn`;
    
    console.log('🔗 PAYPAL: Redirecting to:', paypalUrl);
    
    // Try to open in new tab first, fallback to same window
    try {
      const newWindow = window.open(paypalUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Popup blocked, redirect in same window
        console.log('🚨 PAYPAL: Popup blocked, redirecting in same window');
        window.location.href = paypalUrl;
      } else {
        console.log('✅ PAYPAL: Opened in new tab');
        // Close the cart since payment is in progress
        onClose();
      }
    } catch (error) {
      console.error('❌ PAYPAL: Error opening window:', error);
      // Fallback to same window redirect
      window.location.href = paypalUrl;
    }
  };

  // Calculate shipping based on weight and destination
  function calculateShipping() {
    // Free pickup option
    if (formData.deliveryMethod === 'pickup') {
      console.log('🏪 FREE PICKUP: Customer selected pickup option');
      return 0;
    }
    
    // Check if cart contains $5 pine cars - if so, free shipping!
    const hasPineCars = items.some(item => 
      item.product.price === 5.00 && 
      (item.product.name.toLowerCase().includes('pine') || 
       item.product.name.toLowerCase().includes('car') ||
       item.product.name.toLowerCase().includes('ute') ||
       item.product.name.toLowerCase().includes('small'))
    );
    
    if (hasPineCars) {
      console.log('🚗 FREE SHIPPING: Cart contains $5 special offer items!');
      return 0;
    }
    
    // Free shipping on orders over $1000 NZD
    if (total >= 1000) {
      console.log('🚢 FREE SHIPPING: Order over $1000');
      return 0;
    }
    
    // Calculate shipping based on destination and weight
    let shippingCost = 0;
    
    switch (formData.country) {
      case 'NZ':
        if (totalWeight <= 1) shippingCost = 8.50;
        else if (totalWeight <= 2) shippingCost = 12.00;
        else if (totalWeight <= 3) shippingCost = 18.00;
        else if (totalWeight <= 4) shippingCost = 25.00;
        else shippingCost = 30.00;
        break;
      case 'AU':
        shippingCost = totalWeight <= 1 ? 25.00 : 35.00;
        break;
      case 'US':
      case 'CA':
        shippingCost = totalWeight <= 1 ? 35.00 : 50.00;
        break;
      case 'GB':
        shippingCost = totalWeight <= 1 ? 40.00 : 55.00;
        break;
      default:
        shippingCost = totalWeight <= 1 ? 50.00 : 70.00;
        break;
    }
    
    console.log(`🚢 SHIPPING: ${formData.country} - ${totalWeight}kg = $${shippingCost}`);
    return shippingCost;
  }

  // Success screen
  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>
          <div className="text-sm text-gray-500">
            Order total: ${grandTotal.toFixed(2)} NZD
          </div>
        </div>
      </div>
    );
  }

  // Checkout screen
  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen flex items-start justify-center p-4">
          <div className="bg-white w-full max-w-2xl my-8 rounded-xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button onClick={handleCloseCheckout} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-red-500 mt-0.5" size={20} />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-bold">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        {formData.deliveryMethod === 'pickup' ? 'Pickup:' : `Shipping (${totalWeight.toFixed(1)}kg to ${formData.country}):`}
                      </span>
                      <span>
                        {formData.deliveryMethod === 'pickup' ? 'FREE' : shipping === 0 ? (
                          total >= 1000 ? 'FREE (Order over $1000)' :
                          items.some(item => item.product.price === 5.00 && 
                            (item.product.name.toLowerCase().includes('pine') || 
                             item.product.name.toLowerCase().includes('car'))) ? 
                          'FREE (Special Offer)' : 'FREE'
                        ) : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {formData.deliveryMethod === 'pickup' && (
                      <div className="text-xs text-green-600">
                        🏪 Free pickup from our Whangarei workshop (by appointment)
                      </div>
                    )}
                    {shipping === 0 && total >= 150 && formData.deliveryMethod !== 'pickup' && (
                      <div className="text-xs text-green-600">
                        🎉 {total >= 1000 ? 'Free shipping on orders over $1000!' : 
                            items.some(item => item.product.price === 5.00 && 
                              (item.product.name.toLowerCase().includes('pine') || 
                               item.product.name.toLowerCase().includes('car'))) ? 
                            'Special offer: Free shipping on this item!' : 'Free shipping!'}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${grandTotal.toFixed(2)} NZD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Choose Payment Method</h3>
                
                {/* Test Mode Toggle */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={testMode}
                      onChange={(e) => setTestMode(e.target.checked)}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-yellow-800">
                      🧪 Test Mode (enable only for testing - payments will be simulated)
                    </span>
                  </label>
                  <p className="text-xs text-yellow-700 mt-1">
                    {testMode ? 'TEST: Payments will be simulated' : 'LIVE: Real payments will be processed'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'stripe'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 text-blue-800">
                      <CreditCard size={24} />
                      <span className="font-bold">Credit Card</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Pay with Visa, Mastercard, or Amex</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <span className="font-bold text-blue-600">PayPal</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Pay with your PayPal account</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {testMode ? '🧪 Test mode: Will simulate PayPal payment' : '💳 Live mode: Real PayPal payment'}
                    </p>
                  </button>
                </div>
              </div>

              {/* DELIVERY METHOD SELECTION */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'shipping' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.deliveryMethod === 'shipping'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 text-blue-800">
                      <span className="text-2xl">📦</span>
                      <span className="font-bold">Ship to Me</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Delivered to your address</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Shipping: {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)} NZD`}
                    </p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.deliveryMethod === 'pickup'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 text-green-800">
                      <span className="text-2xl">🏪</span>
                      <span className="font-bold">FREE Pickup</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Pickup from our workshop</p>
                    <p className="text-xs text-gray-600 mt-1">
                      102 Kiripaka Rd, Whangarei (by appointment)
                    </p>
                  </button>
                </div>
              </div>

              {/* CONTACT & SHIPPING INFO */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <input
                  type="email"
                  placeholder="Email address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4"
                />
              </div>

              {formData.deliveryMethod === 'shipping' && (
                <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Street address *"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City *"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Postal code *"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="NZ">New Zealand</option>
                    <option value="AU">Australia</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
                </div>
              )}

              {formData.deliveryMethod === 'pickup' && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    🏪 Workshop Pickup Details
                  </h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Address:</strong> 102 Kiripaka Rd, Whangarei, New Zealand</p>
                    <p><strong>Hours:</strong> Monday-Friday 9AM-5PM, Saturday 10AM-2PM</p>
                    <p><strong>Contact:</strong> 021 022 8166</p>
                    <p><strong>Note:</strong> Please call ahead to arrange pickup time</p>
                  </div>
                  <div className="mt-3 p-3 bg-green-100 rounded">
                    <p className="text-green-800 font-medium text-sm">
                      🎉 FREE PICKUP - Save ${shipping.toFixed(2)} NZD on shipping!
                    </p>
                  </div>
                </div>
              )}

              {/* PAYMENT FORMS */}
              {paymentMethod === 'stripe' ? (
                <form onSubmit={handleStripePayment} className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Credit Card Details</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Card number (4242 4242 4242 4242 for testing) *"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY (12/34 for testing) *"
                          required
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="CVV (123 for testing) *"
                          required
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                    <Lock className="text-blue-600 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Secure Payment</p>
                      <p>Your payment information is encrypted and secure. We never store your card details.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        <span>Pay ${grandTotal.toFixed(2)} NZD with Credit Card</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">PayPal Payment</h3>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-blue-800 text-sm">
                        Click the button below to pay securely with PayPal. You'll be redirected to PayPal's secure payment page.
                      </p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        Order Total: ${grandTotal.toFixed(2)} NZD ({items.length} item{items.length !== 1 ? 's' : ''})
                      </p>
                      <div className="text-xs text-green-700 mt-1">
                        {items.map((item, index) => (
                          <div key={index}>• {item.product.name} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}</div>
                        ))}
                        <div className="border-t pt-1 mt-1">
                          <div>• Subtotal: ${total.toFixed(2)} NZD</div>
                          <div>• Shipping: ${shipping.toFixed(2)} NZD</div>
                          <div className="font-bold">• Total: ${grandTotal.toFixed(2)} NZD</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple PayPal Button */}
                    <button
                      onClick={() => {
                       console.log('🔘 PAYPAL BUTTON CLICKED');
                       setError(''); // Clear any previous errors
                        if (validatePayPalForm()) {
                          if (testMode) {
                            // In test mode, simulate success
                            console.log('🧪 TEST MODE: Simulating PayPal success');
                            setSuccess(true);
                            setTimeout(() => {
                              items.forEach(item => onRemoveItem(item.product.id));
                              handleCloseCheckout();
                              onClose();
                            }, 2000);
                          } else {
                           console.log('🚀 LIVE MODE: Calling PayPal redirect');
                            handlePayPalRedirect();
                          }
                       } else {
                         console.log('❌ PAYPAL: Form validation failed');
                        }
                      }}
                      disabled={processing}
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
                    >
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">PP</span>
                      </div>
                      <span>
                        {testMode ? '🧪 Test PayPal Payment' : `💳 Pay ${grandTotal.toFixed(2)} NZD with PayPal`}
                      </span>
                    </button>
                    
                    {/* PayPal Info */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                      <p className="font-medium text-blue-800 mb-1">PayPal Payment Details:</p>
                      <p className="text-blue-700">• Total: ${grandTotal.toFixed(2)} NZD</p>
                      <p className="text-blue-700">• Items: {items.length}</p>
                      <p className="text-blue-700">• Mode: {testMode ? '🧪 TEST (Simulated)' : '💳 LIVE (Real payments)'}</p>
                      <p className="text-blue-700">• You'll be redirected to PayPal's secure payment page</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY INFO */}
              <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <p className="font-bold text-lg text-green-800">🔒 Secure Payment Options Available</p>
                <p className="text-green-700">Both Stripe and PayPal use industry-standard encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-end p-2 sm:p-4">
        <div className="bg-white w-full max-w-sm sm:max-w-md h-full max-h-screen overflow-y-auto rounded-l-xl shadow-2xl">
          <div className="bg-amber-600 text-white p-2 text-center font-bold">
            🛒 Shopping Cart - Multiple Payment Options
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-amber-600" size={24} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Cart ({items.length})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some beautiful wooden toys to get started!</p>
                <button
                  onClick={onClose}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0 product-image-container">
                        <img
                          src={item.product.images[0] || '/FB_IMG_1640827671355.jpg'}
                          alt={`${item.product.name} in shopping cart - $${item.product.price} NZD - Handcrafted wooden toy`}
                          className="product-image rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/FB_IMG_1640827671355.jpg';
                            target.alt = `${item.product.name} - Cart item image unavailable`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{item.product.name}</h3>
                        <p className="text-amber-600 font-semibold text-sm sm:text-base">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product.stockQuantity || 0)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
                        >
                          <Plus size={16} />
                        </button>
                        {item.quantity >= (item.product.stockQuantity || 0) && (
                          <div className="text-xs text-red-600 mt-1">
                            Max stock: {item.product.stockQuantity || 0}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors touch-target flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-amber-600">${grandTotal.toFixed(2)} NZD</span>
                  </div>
                  
                  {/* Shipping info */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)} NZD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping ({totalWeight.toFixed(1)}kg):</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)} NZD`}</span>
                      </div>
                      {shipping === 0 && total >= 1000 && (
                        <div className="text-green-600 text-xs">
                          🎉 Free shipping on orders over $1000!
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors mobile-button touch-target"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => items.forEach(item => onRemoveItem(item.product.id))}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors mobile-button touch-target"
                    >
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