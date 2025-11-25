import React from 'react';
import { Home, Search, Package } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🪵</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          Let's get you back to our beautiful wooden toys!
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onGoHome}
            className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onGoHome}
              className="flex-1 border border-amber-300 text-amber-700 py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center space-x-1"
            >
              <Package size={16} />
              <span>Shop Toys</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;