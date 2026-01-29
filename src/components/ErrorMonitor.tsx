import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

/**
 * ErrorMonitor Component
 * Detects and reports critical website issues
 * Add this to your App.tsx
 */
export const ErrorMonitor: React.FC = () => {
  const { products } = useProducts();

  useEffect(() => {
    // Monitor for React errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('🚨 CRITICAL ERROR DETECTED:', event.error);
      
      // Show visible alert to user
      const alertDiv = document.createElement('div');
      alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 999999;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      `;
      alertDiv.innerHTML = `
        <strong>⚠️ Website Error Detected</strong><br/>
        <small>${event.error?.message || 'Unknown error'}</small><br/>
        <button onclick="this.parentElement.remove()" 
                style="margin-top:10px;background:white;color:#dc2626;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
          Dismiss
        </button>
      `;
      document.body.appendChild(alertDiv);
    };

    window.addEventListener('error', errorHandler);

    return () => window.removeEventListener('error', errorHandler);
  }, []);

  useEffect(() => {
    // Check for product count mismatch
    const checkProductCount = () => {
      // Wait for DOM to be ready
      setTimeout(() => {
        const productElements = document.querySelectorAll('[class*="grid"]')[0]?.children.length || 0;
        const databaseProducts = products.length;

        console.log('📊 Product Count Check:');
        console.log('  - Database:', databaseProducts);
        console.log('  - Displayed:', productElements);

        // Alert if major mismatch (allowing for some variation due to layout)
        if (databaseProducts > 20 && productElements < databaseProducts * 0.5) {
          console.warn('⚠️ PRODUCT DISPLAY ISSUE DETECTED!');
          console.warn(`Only ${productElements} of ${databaseProducts} products are showing`);
          
          // Show admin alert
          if (window.location.pathname === '/') {
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = `
              position: fixed;
              bottom: 20px;
              left: 20px;
              background: #f59e0b;
              color: white;
              padding: 15px;
              border-radius: 8px;
              z-index: 999999;
              max-width: 350px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            `;
            warningDiv.innerHTML = `
              <strong>⚠️ Product Display Warning</strong><br/>
              <small>Only ${productElements}/${databaseProducts} products showing on homepage</small><br/>
              <button onclick="this.parentElement.remove()" 
                      style="margin-top:10px;background:white;color:#f59e0b;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                Dismiss
              </button>
            `;
            document.body.appendChild(warningDiv);
          }
        }
      }, 3000);
    };

    if (products.length > 0) {
      checkProductCount();
    }
  }, [products]);

  return null; // This component doesn't render anything
};

export default ErrorMonitor;
