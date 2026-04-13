exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  try {
    const {
      name, email, phone,
      productType, woodType, sizePreset,
      length, width, height,
      finish, quantity, details,
    } = JSON.parse(event.body);

    const dimensionStr = [
      length && `L: ${length}cm`,
      width  && `W: ${width}cm`,
      height && `H: ${height}cm`,
    ].filter(Boolean).join(', ') || 'Not specified';

    const payload = {
      from: "Poppa's Website <noreply@poppaswoodencreations.co.nz>",
      to: ['poppas.wooden.creations@gmail.com'],
      reply_to: email,
      subject: `🪵 New Custom Order Request from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
          <div style="background:white;padding:30px;border-radius:10px;border-top:4px solid #d97706;">
            <h2 style="color:#d97706;margin-top:0;">🪵 New Custom Order Request</h2>

            <h3 style="color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Customer Details</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px;font-weight:bold;color:#374151;width:140px;">Name:</td><td style="padding:8px;">${name}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Email:</td><td style="padding:8px;"><a href="mailto:${email}" style="color:#d97706;">${email}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#374151;">Phone:</td><td style="padding:8px;">${phone || 'Not provided'}</td></tr>
            </table>

            <h3 style="color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Order Details</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px;font-weight:bold;color:#374151;width:140px;">Product:</td><td style="padding:8px;">${productType}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Timber:</td><td style="padding:8px;">${woodType}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#374151;">Size:</td><td style="padding:8px;">${sizePreset}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Dimensions:</td><td style="padding:8px;">${dimensionStr}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#374151;">Finish:</td><td style="padding:8px;">${finish || "Adrian's choice"}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Quantity:</td><td style="padding:8px;">${quantity}</td></tr>
            </table>

            ${details ? `
            <h3 style="color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Extra Details</h3>
            <div style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #d97706;">
              <p style="color:#111827;white-space:pre-wrap;margin:0;">${details}</p>
            </div>
            ` : ''}

            <p style="margin-top:24px;font-size:13px;color:#6b7280;">
              Hit Reply to respond directly to ${name} at ${email}.
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending custom order email to Resend...');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resBody = await res.text();
    console.log('Resend response status:', res.status);
    console.log('Resend response body:', resBody);

    if (!res.ok) {
      throw new Error(`Resend error ${res.status}: ${resBody}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error('send-custom-order-email error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
