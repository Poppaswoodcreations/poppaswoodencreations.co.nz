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

/**
 * Send order notification emails:
 *  - Customer gets a confirmation email
 *  - Owner (Adrian) gets a new order alert
 */
export const sendOrderNotification = async (orderData: OrderNotificationData): Promise<void> => {
  console.log('📧 Sending order emails for:', orderData.orderNumber);

  try {
    const response = await fetch('/.netlify/functions/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email function returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Emails sent:', result);

  } catch (error) {
    // Log the error but don't break the checkout flow
    console.error('❌ Failed to send order emails:', error);

    // Fallback: store order in localStorage so it's not lost
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
      console.warn('📝 Order saved to localStorage as fallback — check admin dashboard');
    } catch {
      // Silent fail on localStorage
    }
  }
};
