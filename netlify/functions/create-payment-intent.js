const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { amount, currency = 'nzd', metadata } = JSON.parse(event.body);
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: metadata || {},
      automatic_payment_methods: { enabled: true },
    });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
