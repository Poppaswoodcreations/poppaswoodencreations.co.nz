import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

interface HeaderProps {
  onShowAdmin: () => void;
  onShowCart: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ onShowAdmin, onShowCart, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { isSupabaseConnected } = useProducts();

  const productCategories = [
    { slug: 'wooden-baby-toys', name: 'Baby Toys' },
    { slug: 'wooden-trucks', name: 'Trucks' },
    { slug: 'wooden-cars', name: 'Cars' },
    { slug: 'wooden-trains', name: 'Trains' },
    { slug: 'wooden-planes-helicopters', name: 'Planes & Helicopters' },
    { slug: 'wooden-kitchenware', name: 'Kitchenware' },
  ];

  const handleAdminClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ['Adrianbar1?', 'admin', 'poppa', 'password', 'poppas'];
    if (validPasswords.includes(password.trim())) {
      onShowAdmin();
      setShowPasswordPrompt(false);
      setPassword('');
      setIsMenuOpen(false);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
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
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a 
            href="/"
            onClick={(e) => { e.preventDefault(); handleCategoryClick('home'); }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-gray-900">Poppa's Wooden Creations</div>
              <p className="text-xs text-gray-600">Handcrafted in New Zealand</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-6">
            <div className="relative group">
              <button className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base">
                Shop
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {productCategories.map((category) => (
                  <a key={category.slug} href={`/${category.slug}`} onClick={(e) => { e.preventDefault(); handleCategoryClick(category.slug); }} className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">{category.name}</a>
                ))}
              </div>
            </div>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleCategoryClick('about'); }} className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base">About</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); handleCategoryClick('blog'); }} className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base">Blog</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleCategoryClick('contact'); }} className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              className="p-2 text-gray-700 hover:text-amber-700 transition-colors"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={onShowCart} 
              className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (<span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItemCount}</span>)}
            </button>
            <button 
              onClick={handleAdminClick} 
              className="hidden md:block p-2 text-gray-700 hover:text-amber-700 transition-colors"
              aria-label="Admin access"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-gray-700 hover:text-amber-700 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              <a href="/" onClick={(e) => { e.preventDefault(); handleCategoryClick('home'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">Home</a>
              <div className="px-4 py-2">
                <div className="font-medium text-gray-900 mb-2">Shop by Category</div>
                <div className="pl-4 space-y-1">
                  {productCategories.map((category) => (
                    <a key={category.slug} href={`/${category.slug}`} onClick={(e) => { e.preventDefault(); handleCategoryClick(category.slug); }} className="block w-full text-left py-2 text-gray-600 hover:text-amber-700 transition-colors">{category.name}</a>
                  ))}
                </div>
              </div>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleCategoryClick('about'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">About Us</a>
              <a href="/blog" onClick={(e) => { e.preventDefault(); handleCategoryClick('blog'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">Blog</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleCategoryClick('contact'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">Contact</a>
              <a href="/reviews" onClick={(e) => { e.preventDefault(); handleCategoryClick('reviews'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">Reviews</a>
              <a href="/shipping" onClick={(e) => { e.preventDefault(); handleCategoryClick('shipping'); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">Shipping</a>
            </div>
          </div>
        )}
      </div>

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Access</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4" autoFocus />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition-colors">Access Admin</button>
                <button type="button" onClick={() => { setShowPasswordPrompt(false); setPassword(''); }} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
