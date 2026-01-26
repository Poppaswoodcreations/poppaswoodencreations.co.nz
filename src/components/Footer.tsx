import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Shield, Award, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200">
      {/* Trust Badges Section */}
      <div className="bg-amber-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* Trust Badge 1 */}
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8" />
              <div className="text-sm font-bold">Secure Checkout</div>
              <div className="text-xs">SSL Encrypted</div>
            </div>

            {/* Trust Badge 2 */}
            <div className="flex flex-col items-center space-y-2">
              <Award className="w-8 h-8" />
              <div className="text-sm font-bold">Made in NZ 🇳🇿</div>
              <div className="text-xs">Handcrafted Quality</div>
            </div>

            {/* Trust Badge 3 */}
            <div className="flex flex-col items-center space-y-2">
              <Package className="w-8 h-8" />
              <div className="text-sm font-bold">Free Shipping</div>
              <div className="text-xs">Orders Over $1000</div>
            </div>

            {/* Trust Badge 4 */}
            <div className="flex flex-col items-center space-y-2">
              <Heart className="w-8 h-8" />
              <div className="text-sm font-bold">30-Day Returns</div>
              <div className="text-xs">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About Company */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Poppa's Wooden Creations</h3>
                <p className="text-xs text-gray-400">Handcrafted in New Zealand</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Creating beautiful, safe wooden toys with love and attention to detail since 2015. 
              Every toy is handcrafted from native NZ timber in Whangarei.
            </p>
            
            {/* Quality Badges */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-green-700 text-white px-2 py-1 rounded font-semibold">Food-Safe Finish</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-blue-600 text-white px-2 py-1 rounded font-semibold">Native NZ Timber</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-purple-600 text-white px-2 py-1 rounded font-semibold">Heirloom Quality</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="pt-4">
              <p className="text-xs text-gray-400 mb-2">We Accept:</p>
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded text-gray-900 text-xs font-bold">VISA</div>
                <div className="bg-white p-2 rounded text-gray-900 text-xs font-bold">MC</div>
                <div className="bg-white p-2 rounded text-gray-900 text-xs font-bold">AMEX</div>
                <div className="bg-blue-600 p-2 rounded text-white text-xs font-bold">PayPal</div>
              </div>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop by Category</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/wooden-baby-toys" className="text-sm hover:text-amber-500 transition-colors">
                  Baby Toys
                </Link>
              </li>
              <li>
                <Link to="/wooden-trucks" className="text-sm hover:text-amber-500 transition-colors">
                  Trucks & Vehicles
                </Link>
              </li>
              <li>
                <Link to="/wooden-cars" className="text-sm hover:text-amber-500 transition-colors">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/wooden-trains" className="text-sm hover:text-amber-500 transition-colors">
                  Trains
                </Link>
              </li>
              <li>
                <Link to="/wooden-planes-helicopters" className="text-sm hover:text-amber-500 transition-colors">
                  Planes & Helicopters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links - UPDATED WITH SEPARATE POLICY LINKS */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-amber-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-sm hover:text-amber-500 transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-amber-500 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm hover:text-amber-500 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-amber-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-amber-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <div className="space-y-3">
              
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>102 Kiripaka Rd</p>
                  <p>Whangarei, Northland 0110</p>
                  <p>New Zealand</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="tel:+6421022816 6" className="text-sm hover:text-amber-500 transition-colors">
                  +64 21 022 8166
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="mailto:poppas.wooden.creations@gmail.com" className="text-sm hover:text-amber-500 transition-colors">
                  poppas.wooden.creations@gmail.com
                </a>
              </div>

              {/* Business Hours */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-white mb-1">Business Hours:</p>
                <p className="text-xs text-gray-400">Mon-Fri: 9AM-3PM NZST</p>
                <p className="text-xs text-gray-400">Sat-Sun: Closed</p>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <p className="text-xs font-semibold text-white mb-2">Follow Us:</p>
                <div className="flex space-x-3">
                  <a 
                    href="https://facebook.com/poppaswooden" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-amber-600 transition-colors"
                    aria-label="Visit our Facebook page"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://instagram.com/poppaswooden" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-amber-600 transition-colors"
                    aria-label="Visit our Instagram page"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-white text-center mb-4">Our Promise to You</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-amber-500 font-semibold mb-1">Quality Guarantee</p>
                <p className="text-gray-400 text-xs">Every toy is inspected before shipping</p>
              </div>
              <div>
                <p className="text-amber-500 font-semibold mb-1">Safe Materials</p>
                <p className="text-gray-400 text-xs">Food-safe finishes, no toxic chemicals</p>
              </div>
              <div>
                <p className="text-amber-500 font-semibold mb-1">Heirloom Quality</p>
                <p className="text-gray-400 text-xs">Built to last 15+ years and beyond</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© {currentYear} Poppa's Wooden Creations. Made with ❤️ in New Zealand</p>
            <p className="mt-2 md:mt-0">All toys handcrafted from native NZ timber</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
