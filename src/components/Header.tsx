import { useState } from 'react';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import SearchModal from './SearchModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navigationItems = [
    { 
      name: 'Shop', 
      dropdown: [
        { name: 'Baby Toys', path: '/wooden-baby-toys' },
        { name: 'Trucks', path: '/wooden-trucks' },
        { name: 'Cars', path: '/wooden-cars' },
        { name: 'Trains', path: '/wooden-trains' },
        { name: 'Planes & Helicopters', path: '/wooden-planes-helicopters' },
        { name: 'Kitchenware', path: '/wooden-kitchenware' },
        { name: 'Crosses', path: '/wooden-crosses' }
      ]
    },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    {
      name: 'Help',
      dropdown: [
        { name: '📦 Shipping Policy', path: '/shipping' },
        { name: '↩️ Returns & Refunds', path: '/returns' },
        { name: '🔒 Privacy Policy', path: '/privacy' },
        { name: '📄 Terms of Service', path: '/terms' }
      ]
    }
  ];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xl text-gray-900">Poppa's Wooden Creations</div>
                <p className="text-xs text-gray-600">Handcrafted in New Zealand</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                item.dropdown ? (
                  <div key={item.name} className="relative group">
                    <button className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base flex items-center space-x-1">
                      <span>{item.name}</span>
                      <svg
                        className="lucide lucide-chevron-down group-hover:rotate-180 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path!}
                    className="text-gray-700 hover:text-amber-700 transition-colors font-medium text-base"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-amber-700 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors"
                aria-label={`Shopping cart with ${cartItemsCount} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="hidden md:block p-2 text-gray-700 hover:text-amber-700 transition-colors"
                aria-label="Admin access"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-amber-700 transition-colors"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <div className="font-medium text-gray-900 py-2">{item.name}</div>
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block py-2 text-gray-600 hover:text-amber-700 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path!}
                      className="block py-2 text-gray-700 hover:text-amber-700 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
