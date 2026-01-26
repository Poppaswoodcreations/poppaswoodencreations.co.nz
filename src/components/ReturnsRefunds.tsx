import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RotateCcw, Shield, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

const ReturnsRefunds: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Returns & Refunds Policy | Poppa's Wooden Creations</title>
        <meta name="description" content="Our 30-day return policy and quality guarantee for handcrafted wooden toys. Easy returns, full refunds, and lifetime craftsmanship guarantee." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds Policy</h1>
            <p className="text-gray-600 text-lg">
              Your satisfaction is our priority. We stand behind every handcrafted toy with our quality guarantee.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Clock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">30-Day Returns</h3>
              <p className="text-sm text-gray-600">Full refund within 30 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">Lifetime craftsmanship guarantee</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Package className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Free Return Shipping</h3>
              <p className="text-sm text-gray-600">We cover return costs</p>
            </div>
          </div>

          {/* 30-Day Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <RotateCcw className="w-6 h-6 text-amber-600 mr-2" />
              30-Day Return Policy
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                We want you to love your handcrafted wooden toy. If for any reason you're not completely satisfied, you can return it within 30 days of delivery for a full refund.
              </p>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 my-6">
                <h3 className="font-semibold text-green-900 mb-2">What's Covered:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full refund within 5-7 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Return shipping costs covered by us</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items must be in original, unused condition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No questions asked policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                  <p className="text-gray-700">
                    Email us at{' '}
                    <a href="mailto:poppas.wooden.creations@gmail.com" className="text-amber-600 hover:underline">
                      poppas.wooden.creations@gmail.com
                    </a>
                    {' '}with your order number and reason for return. We'll respond within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Receive Return Label</h3>
                  <p className="text-gray-700">
                    We'll email you a prepaid return shipping label and instructions. No cost to you!
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pack and Ship</h3>
                  <p className="text-gray-700">
                    Securely pack the item in its original packaging (if possible) and drop it off at your nearest post office or courier.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Receive Your Refund</h3>
                  <p className="text-gray-700">
                    Once we receive and inspect the item, we'll process your full refund within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Conditions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">Eligible for Return:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items in original, unused condition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items with original packaging (if provided)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items returned within 30 days of delivery</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Defective or damaged items (any timeframe)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-700">Not Eligible for Return:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom or personalized items (unless defective)</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items showing signs of use, play, or wear</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items returned after 30 days (except defects)</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Items damaged due to misuse or neglect</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Defective or Damaged Items */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 text-amber-600 mr-2" />
              Defective or Damaged Items
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                We inspect every toy before shipping, but if your item arrives damaged or has a manufacturing defect, we'll make it right immediately.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-600 p-4">
                <h3 className="font-semibold mb-2">What to Do:</h3>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li>Take photos of the damage or defect</li>
                  <li>Email us at poppas.wooden.creations@gmail.com within 7 days</li>
                  <li>Include your order number and photos</li>
                  <li>We'll send a replacement or full refund within 48 hours</li>
                </ol>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                <strong>Note:</strong> For damaged items, you don't need to return the original. Keep it, donate it, or dispose of it responsibly.
              </p>
            </div>
          </div>

          {/* Lifetime Craftsmanship Guarantee */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifetime Craftsmanship Guarantee</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Every toy is built to last generations. If your toy develops a defect due to workmanship or materials (not normal wear and tear), we'll repair or replace it free of charge, no matter how long you've owned it.
              </p>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Our Promise:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Free repairs for manufacturing defects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Replacement if repair isn't possible</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No time limit on craftsmanship issues</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>We cover return shipping for warranty repairs</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                This guarantee covers defects in materials and workmanship only. It does not cover damage from accidents, misuse, normal wear and tear, or modifications.
              </p>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                We currently don't offer direct exchanges. If you'd like a different product:
              </p>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Return your original item for a full refund</li>
                <li>Place a new order for the item you want</li>
                <li>We'll prioritize your new order for fast processing</li>
              </ol>
              <p className="text-sm text-gray-600 mt-4">
                This ensures you get your preferred item as quickly as possible without waiting for the return process to complete.
              </p>
            </div>
          </div>

          {/* Refund Processing */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Processing Time</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>Once we receive your returned item:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span><strong>Inspection:</strong> 1-2 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span><strong>Refund Processing:</strong> 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span><strong>Bank Processing:</strong> 3-5 business days (varies by bank)</span>
                </li>
              </ul>
              <p className="mt-4">
                <strong>Total Time:</strong> Expect your refund within 5-12 business days after we receive your return.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                You'll receive an email confirmation once your refund has been processed.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-amber-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Returns?</h2>
            <p className="text-gray-700 mb-6">
              Our customer service team is here to help with any return or refund questions.
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
              <p className="text-sm text-gray-600 mt-2">Response within 24 hours • Monday-Friday, 9:00 AM - 3:00 PM NZST</p>
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

export default ReturnsRefunds;
