import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState(null);
  const [contactData, setContactData] = useState(null);

  // Load saved footer and contact data
  useEffect(() => {
    try {
      const savedFooter = localStorage.getItem('poppas-footer-settings');
      const savedContact = localStorage.getItem('poppas-contact-settings');
      
      if (savedFooter) {
        const parsed = JSON.parse(savedFooter);
        setFooterData(parsed);
        console.log('📄 Footer: Loaded saved footer data');
      }
      
      if (savedContact) {
        const parsed = JSON.parse(savedContact);
        setContactData(parsed);
        console.log('📞 Footer: Loaded saved contact data');
      }
    } catch (error) {
      console.error('Failed to load footer/contact data:', error);
    }
  }, []);

  // Use saved data if available, otherwise use defaults
  const companyName = footerData?.companyName || "Poppa's Wooden Creations";
  const tagline = footerData?.tagline || "Handcrafted in New Zealand";
  const description = footerData?.description || "Creating beautiful, safe wooden toys with love and attention to detail since 2015.";
  const phone = contactData?.phone || "+64 21 022 8166";
  const email = contactData?.email || "poppas.wooden.creations@gmail.com";
  const address = contactData?.address || {
    street: "102 Kiripaka Rd",
    city: "Whangarei, Northland 0110",
    country: "New Zealand"
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold" aria-label="Poppa's Wooden Creations Logo">P</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{companyName}</h3>
                <p className="text-xs text-gray-300">{tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">{description}</p>
            <div className="flex space-x-4">
              <a 
                href={footerData?.socialMedia?.facebook || "https://www.facebook.com/profile.php?id=100051923245827"} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-400 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={footerData?.socialMedia?.instagram || "https://www.instagram.com/poppas.wooden.creations"} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-400 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={footerData?.socialMedia?.tiktok || "https://www.tiktok.com/@poppaswoodencreations"} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-400 transition-colors"
                aria-label="Visit our TikTok page"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/wooden-trains" className="text-gray-300 hover:text-white transition-colors">All Products</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/wooden-trains" className="text-gray-300 hover:text-white transition-colors">Wooden Trains</a></li>
              <li><a href="/wooden-baby-toys" className="text-gray-300 hover:text-white transition-colors">Baby Toys</a></li>
              <li><a href="/wooden-tractors-boats" className="text-gray-300 hover:text-white transition-colors">Tractors & Boats</a></li>
              <li><a href="/wooden-kitchenware" className="text-gray-300 hover:text-white transition-colors">Kitchenware</a></li>
              <li><a href="/wooden-planes-helicopters" className="text-gray-300 hover:text-white transition-colors">Planes & Helicopters</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-amber-400 mt-0.5" />
                <div className="text-gray-300">
                  <div>102 Kiripaka Rd</div>
                  <div>Whangarei, Northland 0110</div>
                  <div>New Zealand</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-amber-400" />
                <span className="text-gray-300">+64 21 022 8166</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-amber-400" />
                <span className="text-gray-300">poppas.wooden.creations@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-amber-400 rounded-full mt-1"></div>
                <div className="text-gray-300 text-sm">
                  <div>Mon-Fri: 9AM-3PM NZST</div>
                  <div>Saturday: Closed</div>
                  <div>Sunday: Closed</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">Established 2015 • NZ Registered Business</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="space-y-3">
            <p className="text-gray-300 text-sm flex items-center justify-center space-x-1">
              <span>© 2024 {companyName}. Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>in New Zealand</span>
            </p>
            <div className="text-gray-400 text-xs space-y-1 font-medium">
              <p>Secure SSL Encrypted • GDPR Compliant • Privacy Protected</p>
              <p>Registered Business • Established 2015 • New Zealand Made</p>
              <p>Workshop: 102 Kiripaka Rd, Whangarei, Northland 0110, New Zealand</p>
              <p>Phone: +64 21 022 8166 • Email: poppas.wooden.creations@gmail.com</p>
              <p>30-Day Return Policy • Free Shipping Over $1000 NZD • 4.9★ Rating (150+ Reviews)</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
