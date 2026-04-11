const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== 'payment_intent.succeeded') {
    return { statusCode: 200, body: 'Event ignored' };
  }

  const pi = stripeEvent.data.object;
  const m  = pi.metadata || {};

  const customerName   = m.customer_name   || 'Not provided';
  const customerEmail  = m.customer_email  || 'Not provided';
  const deliveryMethod = m.delivery_method || 'shipping';
  const address        = m.address         || '';
  const city           = m.city            || '';
  const postalCode     = m.postal_code     || '';
  const country        = m.country         || 'NZ';
  const isRural        = m.is_rural === 'true';
  const subtotal       = parseFloat(m.subtotal  || '0');
  const shippingCost   = parseFloat(m.shipping  || '0');
  const grandTotal     = pi.amount / 100;
  const orderId        = `STR-${pi.id.slice(-8).toUpperCase()}`;
  const paymentMethod  = m.payment_method  || 'Card';

  // Parse items back from metadata string
  // Format: "Product name x2 ($24.00), Product name x1 ($12.00)"
  const itemsStr = m.items || '';
  const items = itemsStr.split(', ').map(itemStr => {
    const match = itemStr.match(/^(.+) x(\d+) \(\$([0-9.]+)\)$/);
    if (match) {
      const totalPrice = parseFloat(match[3]);
      const quantity = parseInt(match[2]);
      return {
        name: match[1],
        quantity,
        price: totalPrice / quantity,
      };
    }
    return { name: itemStr, quantity: 1, price: 0 };
  });

  const payload = {
    orderNumber: orderId,
    orderTotal: grandTotal,
    subtotal,
    shipping: shippingCost,
    items,
    customer: {
      name: customerName,
      email: customerEmail,
      address,
      city,
      postalCode,
      country,
      deliveryMethod,
    },
    paymentMethod,
  };

  // Use the existing send-order-email function — same as PayPal
  const baseUrl = process.env.SITE_URL || 'https://poppaswoodencreations.co.nz';

  try {
    await fetch(`${baseUrl}/.netlify/functions/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`Order emails sent for ${orderId}`);
  } catch (emailErr) {
    console.error('Failed to send order email:', emailErr);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
