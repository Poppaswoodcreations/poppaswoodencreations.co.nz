// QUICKEST FIX - Add this to your App.jsx
// This adds canonical URLs to ALL pages automatically

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Add this component to your App.jsx
function CanonicalUrl() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    const cleanPath = location.pathname.replace(/\/$/, '') || '';
    const canonicalUrl = `${baseUrl}${cleanPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

// Then in your App.jsx, add it like this:
/*
function App() {
  return (
    <Router>
      <CanonicalUrl />   ← Add this line
      
      <Routes>
        // Your existing routes
      </Routes>
    </Router>
  );
}
*/

export default CanonicalUrl;
