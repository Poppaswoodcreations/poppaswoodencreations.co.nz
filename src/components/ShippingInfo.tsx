import React from 'react';
import { Truck, Package, Globe, Clock, Shield, CreditCard, RotateCcw, AlertCircle } from 'lucide-react';

const ShippingInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Shipping & Returns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We ship our handcrafted wooden toys worldwide with care and attention. 
            Learn about our shipping options, delivery times, and hassle-free return policy.
          </p>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-white p-8 text-center mb-16">
          <Truck className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-2">🎉 FREE SHIPPING on Orders Over $1000 NZD!</h2>
          <p className="text-xl">
            Get free shipping on all orders over $1000 NZD to New Zealand and Australia!
          </p>
          <p className="text-lg mt-2 opacity-90">
            Otherwise standard shipping rates apply. Fast, reliable shipping with tracking included.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Shipping Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="text-blue-500 mr-3" size={32} />
                Shipping Destinations
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We proudly ship our handcrafted wooden toys to customers around the world. 
                All packages are carefully packed to ensure your toys arrive in perfect condition.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">🇳🇿 New Zealand</h3>
                  <p className="text-gray-600">3-5 business days via NZ Post</p>
                  <p className="text-amber-600 font-medium">$8.50 - $30.00 (by weight)</p>
                  <p className="text-green-600 text-sm">FREE over $1000</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">🇦🇺 Australia</h3>
                  <p className="text-gray-600">7-10 business days via Australia Post</p>
                  <p className="text-amber-600 font-medium">$25.00 - $35.00 (by weight)</p>
                  <p className="text-green-600 text-sm">FREE over $1000</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">🌍 International</h3>
                  <p className="text-gray-600">10-21 business days (USA, Canada, UK, Europe)</p>
                  <p className="text-amber-600 font-medium">$35.00 - $70.00 (by destination)</p>
                  <p className="text-green-600 text-sm">FREE over $1000</p>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="text-orange-500 mr-3" size={24} />
                Processing Time
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In-Stock Items:</span>
                    <span className="font-medium text-gray-900">1-2 business days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custom Orders:</span>
                    <span className="font-medium text-gray-900">2-4 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bulk Orders (10+ items):</span>
                    <span className="font-medium text-gray-900">3-5 weeks</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Processing times may be extended during peak seasons 
                    (Christmas, Easter) or for complex custom orders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging & Tracking */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="text-purple-500 mr-3" size={32} />
                Packaging & Care
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Every order is carefully packaged using eco-friendly materials to protect 
                  your wooden toys during transit. We use recycled cardboard, biodegradable 
                  packing peanuts, and minimal plastic.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-green-500" size={16} />
                    <span className="text-gray-600">Protective bubble wrap for fragile items</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="text-blue-500" size={16} />
                    <span className="text-gray-600">Sturdy cardboard boxes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="text-green-500" size={16} />
                    <span className="text-gray-600">Eco-friendly packing materials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-purple-500" size={16} />
                    <span className="text-gray-600">Tracking number provided</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h3>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 mb-4">
                  Once your order ships, you'll receive a tracking number via email. 
                  You can track your package's progress using:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">• NZ Post (New Zealand orders)</p>
                  <p className="text-gray-600">• Australia Post (Australian orders)</p>
                  <p className="text-gray-600">• Local postal service (International orders)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
            <RotateCcw className="text-blue-500 mr-3" size={32} />
            Returns & Exchanges
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">30-Day Return Policy</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We want you to be completely satisfied with your purchase. If you're not 
                happy with your wooden toys for any reason, you can return them within 
                30 days of delivery for a full refund or exchange.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-600">Items must be in original condition</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-600">Original packaging preferred</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-600">Return shipping costs covered by us</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-600">Full refund processed within 5-7 business days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Return</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-600">Contact us at info@poppaswoodencreations.co.nz</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-600">We'll provide a prepaid return label</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-600">Package items securely and ship back</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-600">Receive your refund or exchange</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="text-blue-500 mr-2" size={20} />
              Damaged Items
            </h3>
            <p className="text-gray-600 mb-4">
              If your wooden toys arrive damaged, please contact us immediately with photos. 
              We'll arrange for a replacement or full refund at no cost to you.
            </p>
            <p className="text-sm text-blue-700">
              We take great care in packaging, but accidents can happen during shipping.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="text-amber-500 mr-2" size={20} />
              Custom Orders
            </h3>
            <p className="text-gray-600 mb-4">
              Custom wooden toys are made specifically for you and cannot be returned unless 
              there's a defect or error on our part. We'll work with you to ensure satisfaction.
            </p>
            <p className="text-sm text-amber-700">
              We provide detailed previews and approval process for all custom orders.
            </p>
          </div>
        </div>

        {/* Contact for Questions */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Shipping?</h2>
          <p className="text-xl mb-6">
            Our registered New Zealand business is here to help with shipping and returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Package size={20} />
              <span>Email: poppas.wooden.creations@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck size={20} />
              <span>Phone: 021 022 8166</span>
            </div>
          </div>
          <p className="text-lg mt-4 opacity-90">
            Established 2015 • Registered NZ Business • Workshop in Whangarei
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;