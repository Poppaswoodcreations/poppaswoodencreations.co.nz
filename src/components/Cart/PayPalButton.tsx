import React, { useEffect, useRef } from 'react';

// FIX (16 Aug 2026, earlier x3): order creation/capture moved server-side;
// effect no longer re-initializes on every keystroke; generic SDK error no
// longer overwrites a specific server error message.
//
// DIAGNOSTIC ADD (16 Aug 2026): "paypalOrderId is required" was reaching
// the server, meaning the approval callback's order ID came back empty.
// Added console logging at each stage plus a client-side guard that stops
// and shows a clear message rather than silently sending an empty ID to
// the server — this should surface exactly where things are going wrong
// on the next attempt.

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
            console.log('[PayPal] create-paypal-order response:', res.status, data);

            if (!res.ok || data.error) {
              const msg = data.error || `Could not start PayPal checkout (${res.status})`;
              console.error('[PayPal] createOrder failed:', msg);
              suppressNextGenericErrorRef.current = true;
              onErrorRef.current(msg);
              throw new Error(msg);
            }
            if (!data.orderId) {
              const msg = 'PayPal did not return an order ID from create-paypal-order.';
              console.error('[PayPal]', msg, data);
              suppressNextGenericErrorRef.current = true;
              onErrorRef.current(msg);
              throw new Error(msg);
            }
            console.log('[PayPal] Using orderId:', data.orderId);
            return data.orderId;
          } catch (err: any) {
            const msg = err?.message || 'Could not start PayPal checkout';
            console.error('[PayPal] createOrder exception:', err);
            suppressNextGenericErrorRef.current = true;
            onErrorRef.current(msg);
            throw err;
          }
        },
        onApprove: async (data: any) => {
          console.log('[PayPal] onApprove raw data:', data);
          const currentItems = itemsRef.current;
          const currentFormData = formDataRef.current;

          if (!data || !data.orderID) {
            const msg = 'PayPal approval did not include an order ID — please try again.';
            console.error('[PayPal]', msg, data);
            onErrorRef.current(msg);
            return;
          }

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
            console.log('[PayPal] capture-paypal-order response:', res.status, result);

            if (!res.ok || result.error) {
              const msg = result.error || `Payment capture failed (${res.status})`;
              console.error('[PayPal] capture failed:', msg);
              onErrorRef.current(msg);
              return;
            }
            onSuccessRef.current(result.orderNumber);
          } catch (err: any) {
            console.error('[PayPal] capture-paypal-order exception:', err);
            onErrorRef.current(err.message || 'Payment capture failed');
          }
        },
        onError: (err: any) => {
          console.error('[PayPal] SDK-level onError:', err);
          if (suppressNextGenericErrorRef.current) {
            suppressNextGenericErrorRef.current = false;
            return;
          }
          onErrorRef.current('PayPal payment failed. Please try again or use card payment.');
        },
        onCancel: () => {
          console.log('[PayPal] payment cancelled');
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
