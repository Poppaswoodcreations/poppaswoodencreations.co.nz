const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('save-order: missing Supabase env vars', {
      hasUrl: !!SUPABASE_URL,
      hasKey: !!SUPABASE_SERVICE_KEY,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase env vars not configured' }),
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const orderData = JSON.parse(event.body);
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_number: orderData.orderNumber,
        order_total: orderData.orderTotal,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        items: orderData.items,
        customer: orderData.customer,
        payment_method: orderData.paymentMethod,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, order: data }),
    };
  } catch (error) {
    console.error('save-order error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
