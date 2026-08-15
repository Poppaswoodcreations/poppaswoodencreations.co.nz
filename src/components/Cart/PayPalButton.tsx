import React, { useEffect, useRef } from 'react';

// FIX (16 Aug 2026, earlier): order creation and capture now happen
// server-side via /api/create-paypal-order and /api/capture-paypal-order
// (see those files) instead of trusting a client-computed amount.
//
// FIX (16 Aug 2026): the effect that mounts the PayPal button was
// depending on `items` and `formData` directly. `items` is rebuilt as a
// brand-new array on every render of Cart.tsx (it's created inline with
// .map() in the JSX), and `formData` gets a new object reference on every
// keystroke in the checkout form — so the button was tearing down and
// re-rendering the entire PayPal SDK on every single character typed,
// which looked like constant flashing. The effect now only runs once on
// mount; `items` and `formData` are read via refs inside the click
// handlers instead, so they're always current at the moment the customer
// actually clicks, without forcing a re-render of the button itself.

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

  // Always hold the latest values without forcing the button to
  // re-initialize when they change.
  const itemsRef = useRef(items);
  const formDataRef = useRef(formData);
  itemsRef.current = items;
  formDataRef.current = formData;

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

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
      if (!paypal) { onErrorRef.current('PayPal SDK failed to load'); return; }

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
          const currentItems = itemsRef.current;
          const currentFormData = formDataRef.current;
          const res = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: currentItems,
              deliveryMethod: currentFormData.deliveryMethod,
              country: currentFormData.country || 'NZ',
              postalCode: currentFormData.postalCode || '',
              address: currentFormData.address || '',
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) {
            onErrorRef.current(data.error || 'Could not start PayPal checkout');
            throw new Error(data.error || 'create-paypal-order failed');
          }
          return data.orderId;
        },
        // Payment is captured server-side too — this is when money
        // actually moves, and it's also where the order gets saved and
        // stock decremented (see capture-paypal-order.js).
        onApprove: async (data: any) => {
          const currentItems = itemsRef.current;
          const currentFormData = formDataRef.current;
          try {
            const res = await fetch('/api/capture-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paypalOrderId: data.orderID,
                items: currentItems,
                deliveryMethod: currentFormData.deliveryMethod,
                country: currentFormData.country || 'NZ',
                postalCode: currentFormData.postalCode || '',
                address: currentFormData.address || '',
                customerName: currentFormData.name,
                customerEmail: currentFormData.email,
                city: currentFormData.city || '',
              }),
            });
            const result = await res.json();
            if (!res.ok || result.error) {
              onErrorRef.current(result.error || 'Payment capture failed');
              return;
            }
            onSuccessRef.current(result.orderNumber);
          } catch (err: any) {
            onErrorRef.current(err.message || 'Payment capture failed');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onErrorRef.current('PayPal payment failed. Please try again or use card payment.');
        },
        onCancel: () => {
          console.log('PayPal payment cancelled');
        },
      }).render(containerRef.current);
    };
    script.onerror = () => onErrorRef.current('Failed to load PayPal');
    document.body.appendChild(script);
    return () => {
      renderedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div ref={containerRef} id="paypal-button-container" />
    </div>
  );
};

export default PayPalButton;
