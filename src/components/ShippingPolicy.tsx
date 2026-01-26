import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, Clock, MapPin, Shield, DollarSign, Truck } from 'lucide-react';

const ShippingPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | Poppa's Wooden Creations</title>
        <meta name="description" content="Learn about our worldwide shipping, delivery times, and free shipping offers for handcrafted wooden toys from New Zealand." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Delivery Policy</h1>
            <p className="text-gray-600 text-lg">
              Fast, secure, and eco-friendly shipping for your handcrafted wooden toys from Whangarei, New Zealand.
            </p>
          </div>

          {/* Quick Facts */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Truck className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">Orders over $1000 NZD</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Package className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Tracked Delivery</h3>
              <p className="text-sm text-gray-600">All orders include tracking</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Secure Packaging</h3>
              <p className="text-sm text-gray-600">Eco-friendly materials</p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 text-amber-600 mr-2" />
              Shipping Locations
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">New Zealand Shipping</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>Standard Shipping:</strong> 3-5 business days to major cities (Auckland, Wellington, Christchurch)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>Regional Areas:</strong> 5-7 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>Cost:</strong> $8.50 NZD (FREE for orders over $1000 NZD)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">International Shipping</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>Australia:</strong> 7-14 business days - $25 NZD</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>USA & Canada:</strong> 10-21 business days - $45 NZD</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>UK & Europe:</strong> 14-28 business days - $55 NZD</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span><strong>Asia & Pacific:</strong> 10-21 business days - $35 NZD</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-3 italic">
                  * International shipping times may vary due to customs processing. Customer is responsible for any import duties or taxes.
                </p>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 text-amber-600 mr-2" />
              Processing & Handling
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Standard Products:</strong> Most in-stock items are processed and shipped within 1-3 business days of order confirmation.
              </p>
              <p>
                <strong>Custom Orders:</strong> Handcrafted custom pieces require 2-4 weeks production time before shipping. You'll receive updates throughout the creation process.
              </p>
              <p>
                <strong>Business Days:</strong> Monday - Friday, 9:00 AM - 3:00 PM NZST. Orders placed after 12:00 PM NZST will be processed the next business day.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> During peak holiday seasons (November-December), processing times may extend by 2-3 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 text-amber-600 mr-2" />
              Order Tracking
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                All orders include tracking information. Once your order ships, you'll receive:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Email confirmation with tracking number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Direct link to track your parcel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Estimated delivery date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Delivery updates via email</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                If you have any questions about your shipment, please contact us at{' '}
                <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:underline">
                  poppas.wooden.creations@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Packaging */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eco-Friendly Packaging</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                We care about the environment as much as we care about our toys. All orders are packaged using:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🌱</span>
                  <span>Recycled cardboard boxes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🌱</span>
                  <span>Biodegradable packing peanuts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🌱</span>
                  <span>Paper tape (plastic-free)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🌱</span>
                  <span>Minimal packaging materials</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Every toy is carefully wrapped to ensure it arrives in perfect condition while minimizing environmental impact.
              </p>
            </div>
          </div>

          {/* Shipping Issues */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Issues</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-2">Lost or Damaged Parcels</h3>
                <p>
                  If your order is lost in transit or arrives damaged, please contact us immediately at{' '}
                  <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:underline">
                    poppas.wooden.creations@gmail.com
                  </a>
                  {' '}with your order number and photos (if damaged). We'll arrange a replacement or full refund within 48 hours.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Delivery Delays</h3>
                <p>
                  While rare, delays can occur due to weather, customs, or carrier issues. If your order hasn't arrived within the expected timeframe, we'll investigate with the courier and keep you updated.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Incorrect Address</h3>
                <p>
                  Please double-check your shipping address before completing your order. If you notice an error after placing your order, contact us immediately. We cannot change the address once the parcel has been dispatched.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-amber-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Shipping?</h2>
            <p className="text-gray-700 mb-6">
              Our team is here to help with any shipping questions or concerns.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:underline">
                  poppas.wooden.creations@gmail.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong>{' '}
                <a href="tel:+6421022816 6" className="text-amber-600 hover:underline">
                  +64 21 022 8166
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-2">Monday-Friday, 9:00 AM - 3:00 PM NZST</p>
            </div>
            <Link 
              to="/contact" 
              className="inline-block mt-6 bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
