const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

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
