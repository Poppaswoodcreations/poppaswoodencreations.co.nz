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
    const { name, email, phone, subject, message, orderType } = JSON.parse(event.body);

    const orderTypeLabels = {
      general: 'General Inquiry',
      custom: 'Custom Order',
      wholesale: 'Wholesale/Bulk Order',
      shipping: 'Shipping Question',
      return: 'Return/Exchange',
      repair: 'Repair Service',
    };

    const typeLabel = orderTypeLabels[orderType] || orderType;

    const payload = {
      from: "Poppa's Website <onboarding@resend.dev>",
      to: ['poppas.wooden.creations@gmail.com'],
      reply_to: email,
      subject: `[${typeLabel}] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
          <div style="background:white;padding:30px;border-radius:10px;border-top:4px solid #d97706;">
            <h2 style="color:#d97706;margin-top:0;">New Contact Form Message</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px;font-weight:bold;color:#374151;width:120px;">Name:</td><td style="padding:8px;color:#111827;">${name}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Email:</td><td style="padding:8px;"><a href="mailto:${email}" style="color:#d97706;">${email}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#374151;">Phone:</td><td style="padding:8px;color:#111827;">${phone || 'Not provided'}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Type:</td><td style="padding:8px;color:#111827;">${typeLabel}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#374151;">Subject:</td><td style="padding:8px;color:#111827;">${subject}</td></tr>
            </table>
            <div style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #d97706;">
              <p style="font-weight:bold;color:#374151;margin-top:0;">Message:</p>
              <p style="color:#111827;white-space:pre-wrap;margin-bottom:0;">${message}</p>
            </div>
            <p style="margin-top:20px;font-size:13px;color:#6b7280;">
              Hit Reply to respond directly to ${name} at ${email}.
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending contact email to Resend...');

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
    console.error('send-contact-email error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
