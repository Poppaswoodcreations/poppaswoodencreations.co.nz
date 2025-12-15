import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

interface HeaderProps {
  onCategorySelect: (category: string) => void;
  onShowAdmin: () => void;
  onShowCart: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ onCategorySelect, onShowAdmin, onShowCart, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { isSupabaseConnected } = useProducts();

  const productCategories = [
    { slug: 'wooden-trains', name: 'Trains' },
    { slug: 'wooden-baby-toys', name: 'Baby Toys' },
    { slug: 'wooden-trucks', name: 'Trucks' },
    { slug: 'wooden-cars', name: 'Cars' },
    { slug: 'wooden-planes-helicopters', name: 'Planes' },
    { slug: 'wooden-kitchenware', name: 'Kitchen' },
    { slug: 'wooden-tractors-boats', name: 'Tractors & Boats' }
  ];

  const handleAdminClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ['Adrianbar1?', 'admin', 'poppa', 'password', 'poppas'];
    if (validPasswords.includes(password.trim())) {
      console.log('✅ Admin access granted with password:', password.trim());
      onShowAdmin();
      setShowPasswordPrompt(false);
      setPassword('');
      setIsMenuOpen(false);
    } else {
      console.log('❌ Invalid password attempt:', password.trim());
      alert('❌ Incorrect password!\n\n✅ Valid passwords:\n• Adrianbar1? (your main password)\n• admin\n• poppa\n• password\n• poppas\n\nTry: Adrianbar1?');
      setPassword('');
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    console.log('🔄 Header: Navigating to category:', categorySlug);
    
    if (categorySlug === 'home') {
      navigate('/');
    } else if (categorySlug === 'about') {
      navigate('/about');
    } else if (categorySlug === 'contact') {
      navigate('/contact');
    } else if (categorySlug === 'reviews') {
      navigate('/reviews');
    } else if (categorySlug === 'shipping') {
      navigate('/shipping');
    } else if (categorySlug === 'blog') {
      navigate('/blog');
    } else if (categorySlug === 'privacy') {
      navigate('/privacy');
    } else if (categorySlug === 'terms') {
      navigate('/terms');
    } else {
      navigate(`/${categorySlug}`);
    }
    
    onCategorySelect(categorySlug);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleCategoryClick('home')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-gray-900">Poppa's Wooden Creations</h1>
              <p className="text-xs text-gray-600">Handcrafted in New Zealand</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <button
              onClick={() => handleCategoryClick('home')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              Home
            </button>
            
            {productCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-xs xl:text-sm whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
            
            <button
              onClick={() => handleCategoryClick('about')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              About
            </button>
            <button
              onClick={() => handleCategoryClick('contact')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              Contact
            </button>
            <button
              onClick={() => handleCategoryClick('reviews')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              Reviews
            </button>
            <button
              onClick={() => handleCategoryClick('shipping')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              Shipping
            </button>
            <button
              onClick={() => handleCategoryClick('blog')}
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm xl:text-base"
            >
              Blog
            </button>
          </nav>

          {/* Right Side Icons - FIXED: Added aria-labels */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <button
              onClick={onShowCart}
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={handleAdminClick}
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative bg-amber-50 border-2 border-amber-300 rounded-lg"
              title="Admin access"
              aria-label="Open admin dashboard"
            >
              <User size={20} />
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                🔐
              </span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryClick('home')} 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                Home
              </button>
              
              <div className="px-4 py-2">
                <div className="font-medium text-gray-900 mb-2">Product Categories</div>
                <div className="pl-4 space-y-1">
                  {productCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="block w-full text-left py-2 text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <button onClick={() => handleCategoryClick('about')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">About Us</button>
              <button onClick={() => handleCategoryClick('contact')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Contact Us</button>
              <button onClick={() => handleCategoryClick('reviews')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Customer Reviews</button>
              <button onClick={() => handleCategoryClick('shipping')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Shipping Info</button>
              <button onClick={() => handleCategoryClick('blog')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Blog</button>
              <button onClick={() => handleCategoryClick('privacy')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Privacy Policy</button>
              <button onClick={() => handleCategoryClick('terms')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">Terms of Service</button>
            </div>
          </div>
        )}
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Access</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4"
                autoFocus
                aria-label="Admin password"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Access Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
