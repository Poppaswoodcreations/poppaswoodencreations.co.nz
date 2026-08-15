import React, { useEffect, useRef } from 'react';

// FIX (16 Aug 2026, earlier x2): order creation/capture moved server-side;
// effect no longer re-initializes on every keystroke (see prior comments
// in git history for this file).
//
// FIX (16 Aug 2026): when create-paypal-order failed, this both showed the
// specific server error message AND threw (required, to tell the PayPal
// SDK the createOrder call failed) — but throwing also makes the SDK's own
// `onError` handler fire right afterward, which immediately overwrote the
// specific message with a generic "PayPal payment failed" string. The
// person never actually saw what went wrong. `suppressNextGenericErrorRef`
// now tracks whether we've already shown a specific message, so the SDK's
// generic handler skips firing right after.

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

  const itemsRef = useRef(items);
  const formDataRef = useRef(formData);
  itemsRef.current = items;
  formDataRef.current = formData;

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  // Set to true right before we show a specific error message, so the
  // SDK's own generic onError (fired when createOrder rejects) doesn't
  // immediately stomp over it.
  const suppressNextGenericErrorRef = useRef(false);

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
        createOrder: async () => {
          const currentItems = itemsRef.current;
          const currentFormData = formDataRef.current;
          try {
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
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.error) {
              const msg = data.error || `Could not start PayPal checkout (${res.status})`;
              console.error('create-paypal-order failed:', msg);
              suppressNextGenericErrorRef.current = true;
              onErrorRef.current(msg);
              throw new Error(msg);
            }
            return data.orderId;
          } catch (err: any) {
            const msg = err?.message || 'Could not start PayPal checkout';
            console.error('create-paypal-order fetch error:', err);
            suppressNextGenericErrorRef.current = true;
            onErrorRef.current(msg);
            throw err;
          }
        },
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
            const result = await res.json().catch(() => ({}));
            if (!res.ok || result.error) {
              const msg = result.error || `Payment capture failed (${res.status})`;
              console.error('capture-paypal-order failed:', msg);
              onErrorRef.current(msg);
              return;
            }
            onSuccessRef.current(result.orderNumber);
          } catch (err: any) {
            console.error('capture-paypal-order fetch error:', err);
            onErrorRef.current(err.message || 'Payment capture failed');
          }
        },
        onError: (err: any) => {
          console.error('PayPal SDK error:', err);
          if (suppressNextGenericErrorRef.current) {
            suppressNextGenericErrorRef.current = false;
            return;
          }
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
