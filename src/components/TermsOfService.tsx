import React from 'react';
import { FileText, Shield, CreditCard, Truck, RotateCcw, AlertTriangle, Mail, Phone } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These terms govern your use of our website and purchase of our handcrafted wooden toys.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 19, 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="text-blue-600 mr-3" size={28} />
              Business Details
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Business Name:</strong> Poppa's Wooden Creations<br/>
                <strong>Established:</strong> 2015 - Registered New Zealand Business<br/>
                <strong>Physical Address:</strong> 102 Kiripaka Rd, Whangarei, Northland 0110, New Zealand<br/>
                <strong>Phone:</strong> +64 21 022 8166<br/>
                <strong>Email:</strong> poppas.wooden.creations@gmail.com
              </p>
              <p>
                These terms constitute a legally binding agreement between you and Poppa's Wooden Creations, 
                an established New Zealand business operating since 2015.
              </p>
            </div>
          </div>

          {/* Product Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="text-green-600 mr-3" size={28} />
              Product Information & Warranties
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Quality</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• All products are handcrafted from premium New Zealand timber</li>
                  <li>• Products meet New Zealand safety standards for children's toys</li>
                  <li>• Non-toxic finishes and child-safe construction</li>
                  <li>• Natural variations in wood grain and color are normal</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Warranty</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 30-day satisfaction guarantee on all products</li>
                  <li>• Lifetime craftsmanship warranty against manufacturing defects</li>
                  <li>• Normal wear and tear not covered under warranty</li>
                  <li>• Warranty void if product is modified or misused</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="text-purple-600 mr-3" size={28} />
              Payment & Pricing
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Accepted Payments</h3>
                <ul className="space-y-2">
                  <li>• Credit cards (Visa, Mastercard, American Express) via Stripe</li>
                  <li>• PayPal payments</li>
                  <li>• Bank transfers for large orders (contact us)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                <ul className="space-y-2">
                  <li>• All prices displayed in New Zealand Dollars (NZD)</li>
                  <li>• Prices include GST where applicable</li>
                  <li>• Prices subject to change without notice</li>
                  <li>• Custom orders quoted separately</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Truck className="text-amber-600 mr-3" size={28} />
              Shipping & Delivery
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Policy</h3>
                <ul className="space-y-2">
                  <li>• Free shipping on orders over $1000 NZD</li>
                  <li>• Free pickup available from our Whangarei workshop</li>
                  <li>• Shipping costs calculated by weight and destination</li>
                  <li>• Processing time: 1-2 business days for in-stock items</li>
                  <li>• Custom orders: 2-4 weeks processing time</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery</h3>
                <ul className="space-y-2">
                  <li>• Tracking provided for all shipped orders</li>
                  <li>• Delivery times vary by destination (3-21 business days)</li>
                  <li>• Risk of loss transfers upon delivery</li>
                  <li>• Damaged items must be reported within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Returns & Refunds */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <RotateCcw className="text-blue-600 mr-3" size={28} />
              Returns & Refunds
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                <ul className="space-y-2">
                  <li>• 30-day return period from delivery date</li>
                  <li>• Items must be in original condition</li>
                  <li>• Original packaging preferred but not required</li>
                  <li>• Return shipping costs covered by us</li>
                  <li>• Custom orders non-returnable unless defective</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Process</h3>
                <ul className="space-y-2">
                  <li>• Full refund processed within 5-7 business days</li>
                  <li>• Refunds issued to original payment method</li>
                  <li>• Shipping costs refunded for defective items</li>
                  <li>• Exchange available for different size/color</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Liability & Disclaimers */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="text-orange-600 mr-3" size={28} />
              Liability & Disclaimers
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Use</h3>
                <ul className="space-y-2">
                  <li>• Products intended for children 3+ unless otherwise specified</li>
                  <li>• Adult supervision recommended for young children</li>
                  <li>• Products not suitable for children under 3 due to small parts</li>
                  <li>• Use products as intended - not for commercial use</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p>
                  Our liability is limited to the purchase price of the product. We are not liable 
                  for indirect, incidental, or consequential damages. This limitation applies to 
                  the fullest extent permitted by New Zealand law.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
            <div className="text-gray-700">
              <p>
                These terms are governed by New Zealand law. Any disputes will be resolved 
                in the courts of New Zealand. If any provision is found unenforceable, 
                the remaining terms remain in full effect.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-xl mb-6">
              Contact us if you have any questions about our terms of service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2">
                <Mail size={20} />
                <span>poppas.wooden.creations@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={20} />
                <span>+64 21 022 8166</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;