# Payment Processing Setup

This website supports both Stripe and PayPal payment processing.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add environment variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   VITE_STRIPE_SECRET_KEY=sk_test_...
   ```

## PayPal Setup

1. Create a PayPal Business account
2. Get your PayPal Client ID
3. Add environment variables:
   ```
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

## Testing

Use Stripe test cards:
- 4242 4242 4242 4242 (Visa)
- 4000 0025 0000 3155 (Visa Debit)

For PayPal, use the sandbox environment for testing.