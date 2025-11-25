import React from 'react';
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 19, 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="text-blue-600 mr-3" size={28} />
              Who We Are
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Business Name:</strong> Poppa's Wooden Creations<br/>
                <strong>Established:</strong> 2015 - New Zealand Family Business<br/>
                <strong>Address:</strong> 102 Kiripaka Rd, Whangarei, Northland 0110, New Zealand<br/>
                <strong>Phone:</strong> +64 21 022 8166<br/>
                <strong>Email:</strong> poppas.wooden.creations@gmail.com
              </p>
              <p>
                We are an established New Zealand family business specializing in handcrafted wooden toys 
                and kitchenware. We have been serving families worldwide since 2015.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Database className="text-green-600 mr-3" size={28} />
              Information We Collect
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Contact Details:</strong> Name, email address, phone number</li>
                  <li>• <strong>Shipping Information:</strong> Delivery address, postal code</li>
                  <li>• <strong>Payment Information:</strong> Processed securely through Stripe/PayPal (we don't store card details)</li>
                  <li>• <strong>Order History:</strong> Products purchased, order dates, preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Website Usage:</strong> Pages visited, time spent, device type</li>
                  <li>• <strong>Technical Data:</strong> IP address, browser type, operating system</li>
                  <li>• <strong>Cookies:</strong> Essential cookies for website functionality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="text-purple-600 mr-3" size={28} />
              How We Use Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Processing</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Process and fulfill your orders</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Arrange shipping and delivery</li>
                  <li>• Handle returns and refunds</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Service</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Respond to your inquiries</li>
                  <li>• Provide product support</li>
                  <li>• Send important updates</li>
                  <li>• Improve our products and services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="text-red-600 mr-3" size={28} />
              How We Protect Your Data
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Measures</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• SSL encryption for all data transmission</li>
                    <li>• Secure payment processing via Stripe/PayPal</li>
                    <li>• Regular security updates and monitoring</li>
                    <li>• Limited access to personal information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Storage</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Data stored securely in New Zealand</li>
                    <li>• Regular backups and disaster recovery</li>
                    <li>• No unnecessary data retention</li>
                    <li>• GDPR and Privacy Act 2020 compliant</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            <div className="space-y-4 text-gray-700">
              <p>Under New Zealand's Privacy Act 2020 and GDPR, you have the right to:</p>
              <ul className="space-y-2">
                <li>• <strong>Access:</strong> Request a copy of your personal information</li>
                <li>• <strong>Correction:</strong> Update or correct your information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                <li>• <strong>Portability:</strong> Receive your data in a portable format</li>
                <li>• <strong>Objection:</strong> Object to processing of your information</li>
              </ul>
            </div>
          </div>

          {/* Contact for Privacy */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white p-8 mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Privacy Questions?</h2>
            <p className="text-xl mb-6">
              Contact us about your privacy rights or data protection concerns.
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

export default PrivacyPolicy;