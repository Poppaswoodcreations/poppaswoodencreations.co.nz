exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  let orderData;
  try {
    orderData = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const {
    orderNumber,
    orderTotal,
    subtotal,
    shipping,
    items,
    customer,
    paymentMethod,
  } = orderData;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const itemsText = items.map(i => `  • ${i.name} x${i.quantity} = $${(i.price * i.quantity).toFixed(2)} NZD`).join('\n');

  // ── Email to YOU (owner notification) ──────────────────────────────────────
  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:20px;">
      <div style="background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color:#d97706;text-align:center;margin-bottom:20px;">🎉 New Order Received!</h1>

        <div style="background:#fef3c7;padding:15px;border-radius:8px;margin-bottom:20px;">
          <h2 style="margin:0;color:#92400e;">Order #${orderNumber}</h2>
          <p style="margin:5px 0 0;color:#92400e;">
            <strong>Total: $${orderTotal.toFixed(2)} NZD</strong> &bull;
            Payment: ${paymentMethod} &bull;
            ${new Date().toLocaleString('en-NZ')}
          </p>
        </div>

        <h3 style="color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Customer</h3>
        <p style="line-height:1.8;">
          <strong>${customer.name}</strong><br>
          <a href="mailto:${customer.email}">${customer.email}</a><br>
          ${customer.deliveryMethod === 'pickup'
            ? '<strong>🏪 Workshop Pickup</strong>'
            : `${customer.address}<br>${customer.city} ${customer.postalCode}<br>${customer.country}`
          }
        </p>

        <h3 style="color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px;text-align:left;">Item</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="background:#dcfce7;padding:15px;border-radius:8px;text-align:right;">
          <p style="margin:0;">Subtotal: <strong>$${subtotal.toFixed(2)} NZD</strong></p>
          <p style="margin:4px 0;">Shipping: <strong>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)} NZD`}</strong></p>
          <p style="margin:8px 0 0;font-size:20px;color:#059669;"><strong>TOTAL: $${orderTotal.toFixed(2)} NZD</strong></p>
        </div>

        <div style="margin-top:24px;background:#eff6ff;padding:16px;border-radius:8px;text-align:center;">
          <h3 style="color:#1e40af;margin-bottom:8px;">🚀 Next Steps</h3>
          <p style="color:#1e40af;margin:0;">
            1. Prepare the items<br>
            2. ${customer.deliveryMethod === 'pickup' ? 'Contact customer to arrange pickup time' : 'Ship & send tracking info'}<br>
            3. Reply to customer at <a href="mailto:${customer.email}">${customer.email}</a>
          </p>
        </div>
      </div>
    </div>
  `;

  // ── Email to CUSTOMER (confirmation) ───────────────────────────────────────
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:20px;">
      <div style="background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#d97706;margin-bottom:4px;">Poppa's Wooden Creations</h1>
          <p style="color:#6b7280;margin:0;">Handcrafted from Native NZ Timber</p>
        </div>

        <div style="background:#dcfce7;padding:16px;border-radius:8px;margin-bottom:24px;text-align:center;">
          <h2 style="color:#059669;margin:0 0 4px;">✅ Order Confirmed!</h2>
          <p style="color:#059669;margin:0;">Thank you, ${customer.name.split(' ')[0]}! Your order has been received.</p>
        </div>

        <div style="background:#fef3c7;padding:12px 16px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:0;color:#92400e;"><strong>Order #${orderNumber}</strong> &bull; ${new Date().toLocaleDateString('en-NZ')}</p>
        </div>

        <h3 style="color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Your Order</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px;text-align:left;">Item</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="background:#f9fafb;padding:15px;border-radius:8px;text-align:right;margin-bottom:24px;">
          <p style="margin:0;">Subtotal: $${subtotal.toFixed(2)} NZD</p>
          <p style="margin:4px 0;">Shipping: ${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)} NZD`}</p>
          <p style="margin:8px 0 0;font-size:18px;"><strong>Total: $${orderTotal.toFixed(2)} NZD</strong></p>
        </div>

        <h3 style="color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">
          ${customer.deliveryMethod === 'pickup' ? '🏪 Pickup Details' : '📦 Delivery Details'}
        </h3>
        ${customer.deliveryMethod === 'pickup'
          ? `<p style="line-height:1.8;">
               <strong>Workshop Pickup</strong><br>
               102 Kiripaka Rd, Whangarei<br>
               Mon–Fri 9AM–5PM, Sat 10AM–2PM<br>
               We'll be in touch to arrange a pickup time.
             </p>`
          : `<p style="line-height:1.8;">
               ${customer.address}<br>
               ${customer.city} ${customer.postalCode}<br>
               ${customer.country}<br><br>
               <strong>Estimated delivery:</strong> ${customer.country === 'NZ' ? '3–7 business days' : '7–14 business days'}
             </p>`
        }

        <div style="margin-top:24px;background:#fef3c7;padding:16px;border-radius:8px;">
          <h3 style="color:#92400e;margin:0 0 8px;">Questions?</h3>
          <p style="color:#92400e;margin:0;">
            Email us at <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a><br>
            or call <a href="tel:+64210228166">021 022 8166</a>
          </p>
        </div>

        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px;">
          Poppa's Wooden Creations &bull; 102 Kiripaka Rd, Tikipunga, Whangarei, NZ<br>
          <a href="https://poppaswoodencreations.co.nz" style="color:#d97706;">poppaswoodencreations.co.nz</a>
        </p>
      </div>
    </div>
  `;

  const sendEmail = async (to, subject, html, replyTo) => {
    const body = { from: 'Poppas Wooden Creations <orders@poppaswoodencreations.co.nz>', to, subject, html };
    if (replyTo) body.reply_to = replyTo;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }
    return res.json();
  };

  try {
    // Send owner notification
    await sendEmail(
      'poppaswoodencreations@gmail.com',
      `🚨 New Order #${orderNumber} — $${orderTotal.toFixed(2)} NZD`,
      ownerHtml,
      customer.email
    );

    // Send customer confirmation (only if they have an email)
    if (customer.email && customer.email.includes('@')) {
      await sendEmail(
        customer.email,
        `Order Confirmed — Poppa's Wooden Creations #${orderNumber}`,
        customerHtml,
        'poppaswoodencreations@gmail.com'
      );
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
