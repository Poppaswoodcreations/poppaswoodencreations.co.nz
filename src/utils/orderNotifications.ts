/**
 * Order notification utilities
 * Sends emails via Netlify function → Resend (reliable delivery)
 */

interface OrderNotificationData {
  orderTotal: number;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  customer: {
    name: string;
    email: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    deliveryMethod?: string;
  };
  paymentMethod: string;
  orderNumber: string;
}

export const sendOrderNotification = async (orderData: OrderNotificationData): Promise<void> => {
  console.log('📧 Sending order emails for:', orderData.orderNumber);

  try {
    // Calculate subtotal and shipping
    const subtotal = orderData.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
    const shipping = orderData.orderTotal - subtotal;

    // Flatten items so the Netlify function can read them directly
    const flatItems = orderData.items.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const payload = {
      orderNumber: orderData.orderNumber,
      orderTotal: orderData.orderTotal,
      subtotal,
      shipping,
      items: flatItems,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod,
    };

    console.log('📤 Sending payload to send-order-email:', JSON.stringify(payload));

    const response = await fetch('/.netlify/functions/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email function returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Emails sent:', result);

  } catch (error) {
    console.error('❌ Failed to send order emails:', error);

    // Fallback: store order in localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('pending-orders') || '[]');
      localStorage.setItem('pending-orders', JSON.stringify([
        {
          ...orderData,
          timestamp: new Date().toISOString(),
          status: 'email-failed',
        },
        ...existingOrders,
      ]));
      console.warn('📝 Order saved to localStorage as fallback');
    } catch {
      // Silent fail
    }
  }
};
