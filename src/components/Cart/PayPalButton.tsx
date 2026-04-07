import React, { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  grandTotal: number;
  orderId: string;
  customerEmail: string;
  deliveryDate: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const PAYPAL_CLIENT_ID = 'AaTKWO_kVwBAySr7UBFWRQCKSZXzrwZCjeMcxKG5cggnG_6M2L-KGiqUI8ZYTxCudlo_qayN15nTIzdt';

const PayPalButton: React.FC<PayPalButtonProps> = ({
  grandTotal,
  orderId,
  customerEmail,
  deliveryDate,
  onSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;

    // Remove any existing PayPal script
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
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: grandTotal.toFixed(2),
                currency_code: 'NZD',
              },
              description: "Poppa's Wooden Creations Order",
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW',
              return_url: `${window.location.origin}/order-confirmation?order_id=${orderId}&email=${encodeURIComponent(customerEmail)}&delivery_date=${deliveryDate}&source=paypal`,
              cancel_url: window.location.origin,
            },
          });
        },
        onApprove: async (_data: any, actions: any) => {
          try {
            await actions.order.capture();
            onSuccess();
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
  }, [grandTotal]);

  return (
    <div>
      <div ref={containerRef} id="paypal-button-container" />
    </div>
  );
};

export default PayPalButton;
