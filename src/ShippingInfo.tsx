import React from 'react';
import { Helmet } from 'react-helmet-async';

const ShippingReturns: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Shipping & Returns Policy | Poppa's Wooden Creations</title>
        <meta name="description" content="Free shipping over $1000 NZD. 30-day returns on all wooden toys and kitchenware. Fast nationwide delivery across New Zealand." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping & Returns Policy
            </h1>
            <p className="text-lg text-gray-600">
              Poppa's Wooden Creations - Whangarei, New Zealand
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10">
            
            {/* Shipping Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-amber-600 pb-2">
                📦 Shipping Policy
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Rates</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">✓</span>
                      <span><strong>FREE SHIPPING</strong> on all orders over $1,000 NZD</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">✓</span>
                      <span>Orders under $1,000: <strong>$10 NZD</strong> flat rate shipping</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Areas</h3>
                  <p className="text-gray-700">
                    We ship nationwide across New Zealand - from Auckland to Invercargill, Wellington to Queenstown.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Timeframes</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span><strong>Urban areas:</strong> 3-5 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span><strong>Rural areas:</strong> 5-7 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span><strong>Remote locations:</strong> Up to 10 business days</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    * Processing time: 1-2 business days. Delivery time starts after order is dispatched.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Carriers</h3>
                  <p className="text-gray-700">
                    We use trusted New Zealand postal services including NZ Post and CourierPost to ensure safe delivery of your handcrafted wooden toys and kitchenware.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Order Tracking</h3>
                  <p className="text-gray-700">
                    Once your order ships, you'll receive a tracking number via email so you can monitor your delivery.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Packaging</h3>
                  <p className="text-gray-700">
                    Every item is carefully packaged with eco-friendly materials to ensure your handcrafted wooden toys arrive safely and in perfect condition.
                  </p>
                </div>
              </div>
            </section>

            {/* Returns & Exchanges Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-amber-600 pb-2">
                🔄 Returns & Exchanges Policy
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Window</h3>
                  <p className="text-gray-700">
                    We accept returns and exchanges within <strong>30 days</strong> of purchase for both defective and non-defective products.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Eligible Products</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">✓</span>
                      <span>Products must be in <strong>new, unused condition</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">✓</span>
                      <span>Original packaging (if applicable)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">✓</span>
                      <span>No signs of wear or use</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Methods</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span><strong>By mail:</strong> Ship returns to our Whangarei workshop</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span><strong>Drop-off:</strong> Visit us at 102 Kiripaka Rd, Whangarei (Mon-Fri, 9AM-3PM)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Shipping</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">✓</span>
                      <span><strong>FREE return shipping label</strong> - download and print from your order confirmation email</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">✓</span>
                      <span><strong>No restocking fees</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Processing</h3>
                  <p className="text-gray-700 mb-2">
                    Refunds are processed within <strong>30 days</strong> of receiving your returned item.
                  </p>
                  <p className="text-gray-700">
                    Refunds will be issued to your original payment method. Please allow 5-10 business days for the refund to appear in your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Exchanges</h3>
                  <p className="text-gray-700">
                    We accept exchanges for different products or sizes within the 30-day window. Contact us to arrange an exchange.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Defective or Damaged Items</h3>
                  <p className="text-gray-700">
                    If you receive a defective or damaged item, please contact us immediately at <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:text-amber-700 font-semibold">poppas.wooden.creations@gmail.com</a> with photos. We'll arrange a replacement or full refund at no cost to you.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Initiate a Return */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-amber-600 pb-2">
                📝 How to Initiate a Return or Exchange
              </h2>
              
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3 text-lg">1.</span>
                  <span>
                    <strong>Contact us:</strong> Email <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:text-amber-700">poppas.wooden.creations@gmail.com</a> or call <a href="tel:+64210228166" className="text-amber-600 hover:text-amber-700">+64 21 022 8166</a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3 text-lg">2.</span>
                  <span>
                    <strong>Provide details:</strong> Order number, product name, and reason for return
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3 text-lg">3.</span>
                  <span>
                    <strong>Receive return label:</strong> We'll email you a free return shipping label
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3 text-lg">4.</span>
                  <span>
                    <strong>Pack and ship:</strong> Securely package the item and attach the label
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3 text-lg">5.</span>
                  <span>
                    <strong>Get your refund:</strong> Once we receive and inspect the item, your refund will be processed
                  </span>
                </li>
              </ol>
            </section>

            {/* Contact Information */}
            <section className="bg-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📞 Questions?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about shipping, returns, or exchanges, please don't hesitate to contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:text-amber-700">poppas.wooden.creations@gmail.com</a>
                </p>
                <p>
                  <strong>Phone:</strong> <a href="tel:+64210228166" className="text-amber-600 hover:text-amber-700">+64 21 022 8166</a>
                </p>
                <p>
                  <strong>Address:</strong> 102 Kiripaka Rd, Whangarei, Northland 0110, New Zealand
                </p>
                <p>
                  <strong>Hours:</strong> Monday-Friday, 9:00 AM - 3:00 PM NZST
                </p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-200">
              <p>Last updated: January 2026</p>
              <p className="mt-2">
                Poppa's Wooden Creations - Handcrafted in Whangarei, New Zealand since 2015
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingReturns;
