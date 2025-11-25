# 📡 API Documentation - Poppa's Wooden Creations

## 🎯 **COMPLETE API OVERVIEW**

This documentation covers all API endpoints, database operations, and integration points for the complete Poppa's Wooden Creations website.

## 🗄️ **DATABASE SCHEMA**

### **Products Table**
```sql
CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  images text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 5 CHECK (stock_quantity >= 0),
  weight numeric DEFAULT 0.5 CHECK (weight > 0),
  featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔌 **COMPLETE API ENDPOINTS**

### **Products API**
- GET /api/products - Get all products
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### **Orders API**
- POST /api/orders - Create order
- GET /api/orders - Get orders (admin)
- PUT /api/orders/:id - Update order status (admin)

### **Email API**
- POST /api/contact - Send contact form
- POST /api/order-notification - Send order notification

## 💳 **PAYMENT INTEGRATION**

### **Stripe Setup**
```javascript
const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

### **PayPal Setup**
```javascript
const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=your-email@example.com`;
```

## 📧 **EMAIL NOTIFICATIONS**

Order notifications sent to: **adrianbarber8@gmail.com**

---

**Your complete API documentation for the full website!** 🚀