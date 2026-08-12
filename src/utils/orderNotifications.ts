/**
 * Order notification utilities
 * Sends emails via Netlify function → Resend
 * Saves orders to Supabase via Netlify function
 *
 * STOCK TRACKING (13 Aug 2026): now also builds a `stockItems` array
 * (product id + quantity) from the cart items and includes it in the
 * save-order payload — this is the same field name/shape the Stripe
 * webhook already sends, so save-order.js decrements stock and fires a
 * low-stock alert identically regardless of payment method.
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

  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );
  const shipping = orderData.orderTotal - subtotal;

  const flatItems = orderData.items.map(item => ({
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // Product id + quantity per line item, for save-order.js to decrement
  // stock against. Dropped if an item is somehow missing an id, rather
  // than failing the whole order save.
  const stockItems = orderData.items
    .filter(item => item.product && item.product.id && item.quantity > 0)
    .map(item => ({ id: item.product.id, quantity: item.quantity }));

  const payload = {
    orderNumber: orderData.orderNumber,
    orderTotal: orderData.orderTotal,
    subtotal,
    shipping,
    items: flatItems,
    stockItems,
    customer: orderData.customer,
    paymentMethod: orderData.paymentMethod,
  };

  // Run email and save-order in parallel
  await Promise.allSettled([
    // Send emails
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async res => {
      if (!res.ok) throw new Error(`Email function ${res.status}`);
      console.log('✅ Emails sent');
    }),

    // Save to Supabase (also decrements stock for each line item)
    fetch('/api/save-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async res => {
      if (!res.ok) throw new Error(`Save order function ${res.status}`);
      console.log('✅ Order saved to Supabase');
    }),
  ]).then(results => {
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error(`❌ Task ${i} failed:`, result.reason);
      }
    });
  });
};
