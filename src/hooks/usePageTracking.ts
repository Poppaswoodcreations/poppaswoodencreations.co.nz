import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track pageview when route changes
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-VM9XERD2RB', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};
