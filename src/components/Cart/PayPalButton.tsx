import React, { useEffect, useRef } from 'react';

// FIX (16 Aug 2026): previously this component computed the charge amount
// entirely client-side (a `grandTotal` prop passed from Cart.tsx) and sent
// it straight to PayPal via actions.order.create() and actions.order.capture()
// — both running in the browser. Anyone with dev tools open could edit
// that number before paying, and the order/stock-decrement was never
// recorded anywhere real (Cart.tsx's old success handler only called
// sendOrderNotification, which never touched save-order.js). Order
// creation and capture now happen server-side via /api/create-paypal-order
// and /api/capture-paypal-order, which compute the real charge from actual
// Supabase prices and hook into the same save-order.js /
// send-order-email.js pipeline Stripe orders already use — mirroring the
// fix already in place for Stripe (see create-payment-intent.js).

interface CartItemInput {
  id: string;
  quantity: number;
}

interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: string;
}

interface PayPalButtonProps {
  items: CartItemInput[];
  formData: CheckoutFormData;
  onSuccess: (orderNumber: string) => void;
  onError: (msg: string) => void;
}

const PAYPAL_CLIENT_ID = 'AaTKWO_kVwBAySr7UBFWRQCKSZXzrwZCjeMcxKG5cggnG_6M2L-KGiqUI8ZYTxCudlo_qayN15nTIzdt';

const PayPalButton: React.FC<PayPalButtonProps> = ({
  items,
  formData,
  onSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;
    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) existingScript.remove();
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=NZD`;
    script.async = true;
    script.onload = () => {
      if (!containerRef.current) return;
      if (renderedRef.current) return;
      renderedRef.current = true;
      const paypal = (window as any).paypal;
      if (!paypal) { onError('PayPal SDK failed to load'); return; }

      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        // Server creates the order and computes the real amount from
        // actual product prices — the browser only ever supplies item
        // IDs and quantities, never a dollar figure.
        createOrder: async () => {
          const res = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items,
              deliveryMethod: formData.deliveryMethod,
              country: formData.country || 'NZ',
              postalCode: formData.postalCode || '',
              address: formData.address || '',
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) {
            onError(data.error || 'Could not start PayPal checkout');
            throw new Error(data.error || 'create-paypal-order failed');
          }
          return data.orderId;
        },
        // Payment is captured server-side too — this is when money
        // actually moves, and it's also where the order gets saved and
        // stock decremented (see capture-paypal-order.js).
        onApprove: async (data: any) => {
          try {
            const res = await fetch('/api/capture-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paypalOrderId: data.orderID,
                items,
                deliveryMethod: formData.deliveryMethod,
                country: formData.country || 'NZ',
                postalCode: formData.postalCode || '',
                address: formData.address || '',
                customerName: formData.name,
                customerEmail: formData.email,
                city: formData.city || '',
              }),
            });
            const result = await res.json();
            if (!res.ok || result.error) {
              onError(result.error || 'Payment capture failed');
              return;
            }
            onSuccess(result.orderNumber);
          } catch (err: any) {
            onError(err.message || 'Payment capture failed');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError('PayPal payment failed. Please try again or use card payment.');
        },
        onCancel: () => {
          console.log('PayPal payment cancelled');
        },
      }).render(containerRef.current);
    };
    script.onerror = () => onError('Failed to load PayPal');
    document.body.appendChild(script);
    return () => {
      renderedRef.current = false;
    };
  }, [items, formData]);

  return (
    <div>
      <div ref={containerRef} id="paypal-button-container" />
    </div>
  );
};

export default PayPalButton;
