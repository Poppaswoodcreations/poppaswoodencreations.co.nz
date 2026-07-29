import React from 'react';
import { Link } from 'react-router-dom';

const POPULAR_CATEGORIES = [
  { path: '/wooden-trucks', label: 'Wooden Toy Trucks' },
  { path: '/wooden-baby-toys', label: 'Wooden Baby Toys' },
  { path: '/wooden-kitchenware', label: 'Wooden Kitchenware' },
  { path: '/wooden-cars', label: 'Wooden Cars' },
  { path: '/wooden-trains', label: 'Wooden Train Sets' },
  { path: '/products', label: 'All Products' },
];

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="text-7xl mb-4">🪵</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Looks like this page has been sanded down to nothing. The page you're
          looking for doesn't exist, but here are some places to find what you need.
        </p>

        <Link
          to="/"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition mb-10"
        >
          Back to Homepage
        </Link>

        <div className="border-t border-amber-200 pt-8">
          <p className="text-sm font-semibold text-amber-900 mb-4 uppercase tracking-wide">
            Popular Categories
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_CATEGORIES.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className="bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100 text-amber-900 font-medium py-3 px-3 rounded-lg text-sm transition"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-10">
          Still stuck?{' '}
          <Link to="/contact" className="underline hover:text-amber-700">
            Contact us
          </Link>{' '}
          and we'll help you find it.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
