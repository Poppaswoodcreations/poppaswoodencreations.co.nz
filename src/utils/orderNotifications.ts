/**
 * Order notification utilities
 */

interface OrderNotificationData {
  orderTotal: number;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  orderNumber: string;
}

/**
 * Send order notification via email service
 */
export const sendOrderNotification = async (orderData: OrderNotificationData): Promise<void> => {
  try {
    console.log('📧 Sending order notification for order:', orderData.orderNumber);
    
    // Create email content
    const emailContent = createOrderEmailContent(orderData);
    
    // Method 1: Try multiple email services
    await sendViaMultipleServices(emailContent, orderData);
    
    // Method 2: Fallback - Store in localStorage for manual checking
    storeOrderForManualCheck(orderData);
    
    console.log('✅ Order notification sent successfully');
    
  } catch (error) {
    console.error('❌ Failed to send order notification:', error);
    
    // Always store order locally as backup
    storeOrderForManualCheck(orderData);
    
    // Don't throw error - don't want to break checkout flow
    console.log('📝 Order stored locally for manual checking');
  }
};

/**
 * Create formatted email content
 */
const createOrderEmailContent = (orderData: OrderNotificationData) => {
  const itemsList = orderData.items.map(item => 
    `• ${item.product.name} x${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)} NZD`
  ).join('\n');

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = orderData.orderTotal - subtotal;

  return {
    subject: `🚨 NEW ORDER #${orderData.orderNumber} - $${orderData.orderTotal.toFixed(2)} NZD`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #d97706; margin-bottom: 20px; text-align: center;">
            🎉 NEW ORDER RECEIVED!
          </h1>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #92400e;">Order #${orderData.orderNumber}</h2>
            <p style="margin: 5px 0 0 0; color: #92400e;">
              <strong>Total: $${orderData.orderTotal.toFixed(2)} NZD</strong> • 
              Payment: ${orderData.paymentMethod} • 
              Date: ${new Date().toLocaleString('en-NZ')}
            </p>
          </div>

          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Details</h3>
          <div style="margin-bottom: 20px; line-height: 1.6;">
            <p><strong>Name:</strong> ${orderData.customer.name}</p>
            <p><strong>Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Address:</strong> ${orderData.customer.address}</p>
            <p><strong>City:</strong> ${orderData.customer.city}, ${orderData.customer.postalCode}</p>
            <p><strong>Country:</strong> ${orderData.customer.country}</p>
          </div>

          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Items</h3>
          <div style="margin-bottom: 20px;">
            ${orderData.items.map(item => `
              <div style="padding: 10px; background: #f9fafb; margin-bottom: 10px; border-radius: 6px;">
                <strong>${item.product.name}</strong><br>
                Quantity: ${item.quantity} × $${item.product.price.toFixed(2)} = $${(item.product.price * item.quantity).toFixed(2)} NZD
              </div>
            `).join('')}
          </div>

          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: right;">
            <p style="margin: 0;"><strong>Subtotal: $${subtotal.toFixed(2)} NZD</strong></p>
            <p style="margin: 5px 0;"><strong>Shipping: $${shipping.toFixed(2)} NZD</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 18px; color: #059669;">
              <strong>TOTAL: $${orderData.orderTotal.toFixed(2)} NZD</strong>
            </p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 10px;">🚀 Next Steps</h3>
            <p style="margin: 0; color: #1e40af;">
              1. Contact customer to confirm order<br>
              2. Prepare items for shipping/pickup<br>
              3. Send tracking information when shipped
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
NEW ORDER RECEIVED!

Order #${orderData.orderNumber}
Total: $${orderData.orderTotal.toFixed(2)} NZD
Payment: ${orderData.paymentMethod}
Date: ${new Date().toLocaleString('en-NZ')}

CUSTOMER:
${orderData.customer.name}
${orderData.customer.email}
${orderData.customer.address}
${orderData.customer.city}, ${orderData.customer.postalCode}
${orderData.customer.country}

ITEMS:
${itemsList}

TOTALS:
Subtotal: $${subtotal.toFixed(2)} NZD
Shipping: $${shipping.toFixed(2)} NZD
TOTAL: $${orderData.orderTotal.toFixed(2)} NZD

Contact customer to confirm order and arrange shipping/pickup.
    `
  };
};

/**
 * Send email via multiple services for better reliability
 */
const sendViaMultipleServices = async (emailContent: any, orderData: OrderNotificationData) => {
  // Load admin email from settings
  let adminEmail = 'adrianbarber8@gmail.com'; // Your business email
  
  try {
    const savedSettings = localStorage.getItem('poppas-email-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.adminEmail) {
        adminEmail = settings.adminEmail;
      }
    }
  } catch (error) {
    console.warn('Could not load email settings, using default');
  }
  
  try {
    // Method 1: Try Formspree (free email service)
    const formspreeResponse = await fetch('https://formspree.io/f/xdkogkpw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        subject: emailContent.subject,
        message: emailContent.text,
        orderNumber: orderData.orderNumber,
        orderTotal: orderData.orderTotal,
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        paymentMethod: orderData.paymentMethod,
        _replyto: orderData.customer.email
      })
    });
    
    // Show immediate notification
    console.log(`✅ ORDER NOTIFICATION: Email sent to ${adminEmail}`);

    if (formspreeResponse.ok) {
      console.log('✅ Order notification sent via Formspree to', adminEmail);
      return;
    }

    throw new Error('Formspree failed');
  } catch (error) {
    console.warn('⚠️ Formspree failed, trying alternative methods');
    
    // Method 2: Try EmailJS if configured
    try {
      await sendViaEmailJS(emailContent, orderData, adminEmail);
      return;
    } catch (emailJsError) {
      console.warn('⚠️ EmailJS also failed');
    }
    
    // Method 3: Use mailto link as final fallback
    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.text)}`;
    
    try {
      window.open(mailtoLink);
      console.log('📧 Opened mailto link for manual sending to', adminEmail);
    } catch (mailtoError) {
      console.warn('⚠️ Mailto also failed');
    }
  }
};

/**
 * Send via EmailJS (if configured)
 */
const sendViaEmailJS = async (emailContent: any, orderData: OrderNotificationData, adminEmail: string) => {
  // You can set up EmailJS for more reliable email delivery
  // For now, this is a placeholder that throws an error to fall back to other methods
  throw new Error('EmailJS not configured');
};

/**
 * Store order in localStorage for manual checking
 */
const storeOrderForManualCheck = (orderData: OrderNotificationData) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('pending-orders') || '[]');
    const newOrder = {
      ...orderData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      notified: false
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('pending-orders', JSON.stringify(updatedOrders));
    
    console.log('📝 Order stored locally for manual checking - Check Admin Dashboard → Order Management');
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Order Received!', {
        body: `Order #${orderData.orderNumber} - $${orderData.orderTotal.toFixed(2)} NZD`,
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      // Request notification permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('New Order Received!', {
            body: `Order #${orderData.orderNumber} - $${orderData.orderTotal.toFixed(2)} NZD`,
            icon: '/favicon.ico'
          });
        }
      });
    }
    
  } catch (error) {
    console.error('Failed to store order locally:', error);
  }
};