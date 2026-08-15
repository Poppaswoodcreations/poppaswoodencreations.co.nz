// Cloudflare Pages Function: POST /api/send-low-stock-email
// Sends an alert email to Adrian when one or more products' stock has just
// dropped to 1 or 0 units. Called from save-order.js right after a
// genuinely new order is saved and stock is decremented, and from
// admin-products.js after a manual save/update in the admin panel.
//
// FIX (16 Aug 2026): the subject line and body text were hardcoded to say
// "down to 1" / "1 in stock" regardless of the product's actual quantity.
// Since the trigger fires at stock_quantity <= 1, a product that just hit
// 0 (genuinely sold out) still got an email saying "1 in stock" — the
// table below showed the real number, but the headline text was
// misleading at a glance and could read as "no rush" when it's actually
// out of stock. Wording is now threshold-agnostic and per-row.
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return json({ error: 'Email service not configured' }, 500);
  }
  try {
    const { products } = await request.json();
    if (!Array.isArray(products) || products.length === 0) {
      return json({ error: 'products array is required' }, 400);
    }

    const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
    const lowStockCount = products.length - outOfStockCount;

    const rows = products.map(p => {
      const isOut = p.stock_quantity === 0;
      return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${p.name}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;${isOut ? 'color:#dc2626;font-weight:bold;' : ''}">
          ${isOut ? 'OUT OF STOCK' : `${p.stock_quantity} left`}
        </td>
      </tr>
    `;
    }).join('');

    // Build a subject/summary line that reflects what's actually in the
    // batch, rather than assuming everything hit the same number.
    let summaryPhrase;
    if (outOfStockCount > 0 && lowStockCount > 0) {
      summaryPhrase = `${outOfStockCount} out of stock, ${lowStockCount} down to 1`;
    } else if (outOfStockCount > 0) {
      summaryPhrase = `${outOfStockCount} product${outOfStockCount > 1 ? 's' : ''} out of stock`;
    } else {
      summaryPhrase = `${lowStockCount} product${lowStockCount > 1 ? 's' : ''} down to 1`;
    }

    const payload = {
      from: "Poppa's Website <noreply@poppaswoodencreations.co.nz>",
      to: ['poppas.wooden.creations@gmail.com'],
      subject: `⚠️ Low Stock Alert — ${summaryPhrase}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
          <div style="background:white;padding:30px;border-radius:10px;border-top:4px solid #dc2626;">
            <h2 style="color:#dc2626;margin-top:0;">⚠️ Low Stock Alert</h2>
            <p style="color:#374151;">
              The following product${products.length > 1 ? 's need' : ' needs'} attention —
              ${summaryPhrase}:
            </p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr style="background:#f9fafb;">
                <th style="padding:8px;text-align:left;color:#374151;">Product</th>
                <th style="padding:8px;text-align:center;color:#374151;">Stock left</th>
              </tr>
              ${rows}
            </table>
            <p style="font-size:13px;color:#6b7280;">
              Check the Inventory dashboard on your site (/admin/inventory) for the full picture,
              or print/download the low-stock list from there to take out to the workshop.
            </p>
          </div>
        </div>
      `,
    };
    console.log('Sending low-stock alert email to Resend...');
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
    if (!res.ok) {
      console.error('Resend error:', res.status, resBody);
      return json({ error: `Resend error ${res.status}: ${resBody}` }, 500);
    }
    return json({ success: true });
  } catch (error) {
    console.error('send-low-stock-email error:', error.message);
    return json({ error: error.message }, 500);
  }
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
