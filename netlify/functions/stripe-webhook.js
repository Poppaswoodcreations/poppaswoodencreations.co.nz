const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL_USER,
    pass: process.env.NOTIFY_EMAIL_PASS,
  },
});

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
  const itemsStr       = m.items           || 'Not provided';
  const subtotal       = m.subtotal        || '0.00';
  const shippingCost   = m.shipping        || '0.00';
  const grandTotal     = (pi.amount / 100).toFixed(2);
  const orderId        = `STR-${pi.id.slice(-8).toUpperCase()}`;
  const paymentMethod  = m.payment_method  || 'Card';
  const orderDate      = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });

  const addressBlock = deliveryMethod === 'pickup'
    ? '🏪 WORKSHOP PICKUP — 102 Kiripaka Rd, Whangarei'
    : `${address}, ${city} ${postalCode}, ${country}${isRural ? ' (RURAL DELIVERY)' : ''}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
    h1 { background: #b45309; color: white; padding: 20px; margin: 0; border-radius: 8px 8px 0 0; }
    .content { padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 24px; }
    .section h2 { color: #b45309; border-bottom: 2px solid #fde68a; padding-bottom: 6px; font-size: 16px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-weight: bold; font-size: 14px; }
    .grand-total { font-size: 20px; color: #b45309; font-weight: bold; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    .footer { margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px; font-size: 13px; color: #92400e; }
  </style>
</head>
<body>
  <h1>🛒 New Order — Poppa's Wooden Creations</h1>
  <div class="content">
    <div class="section">
      <h2>📋 Order Details</h2>
      <div class="row"><span class="label">Order ID</span><span class="value">${orderId}</span></div>
      <div class="row"><span class="label">Date & Time</span><span class="value">${orderDate}</span></div>
      <div class="row"><span class="label">Payment Method</span><span class="value">${paymentMethod}</span></div>
      <div class="row"><span class="label">Stripe Payment ID</span><span class="value">${pi.id}</span></div>
    </div>
    <div class="section">
      <h2>👤 Customer</h2>
      <div class="row"><span class="label">Name</span><span class="value">${customerName}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${customerEmail}</span></div>
    </div>
    <div class="section">
      <h2>📦 Delivery</h2>
      <div class="row"><span class="label">Method</span><span class="value">${deliveryMethod === 'pickup' ? 'Workshop Pickup' : 'Shipping'}</span></div>
      <div class="row"><span class="label">Address</span><span class="value">${addressBlock}</span></div>
    </div>
    <div class="section">
      <h2>🪵 Items Ordered</h2>
      ${itemsStr.split(', ').map(item => `<div class="row"><span class="value">• ${item}</span></div>`).join('')}
    </div>
    <div class="section">
      <h2>💰 Payment Summary</h2>
      <div class="row"><span class="label">Subtotal</span><span class="value">$${subtotal} NZD</span></div>
      <div class="row"><span class="label">Shipping</span><span class="value">${shippingCost === '0.00' ? 'FREE' : `$${shippingCost} NZD`}</span></div>
      ${isRural ? '<div class="row"><span class="label">Rural surcharge</span><span class="value">$5.70 NZD</span></div>' : ''}
      <div class="row" style="margin-top:8px;"><span class="label" style="font-size:16px;font-weight:bold;">TOTAL PAID</span><span class="grand-total">$${grandTotal} NZD</span></div>
      <div style="margin-top:8px;"><span class="badge">✅ Payment Confirmed</span></div>
    </div>
    <div class="footer">
      <strong>Next steps:</strong> Pack the order and arrange ${deliveryMethod === 'pickup' ? 'a pickup time with the customer' : 'shipping'}.
      Reply to <a href="mailto:${customerEmail}">${customerEmail}</a> if you need to contact them.
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Poppa's Orders" <${process.env.NOTIFY_EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL_USER,
      subject: `🛒 New Order ${orderId} — $${grandTotal} NZD — ${customerName}`,
      html: htmlBody,
    });
  } catch (emailErr) {
    console.error('Failed to send order email:', emailErr);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
