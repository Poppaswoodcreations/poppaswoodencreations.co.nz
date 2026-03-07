import { useEffect } from 'react';

/**
 * ErrorMonitor Component
 * Detects and reports critical website errors only
 */
export const ErrorMonitor: React.FC = () => {

  useEffect(() => {
    // Monitor for React errors only - no product count checking
    const errorHandler = (event: ErrorEvent) => {
      console.error('🚨 CRITICAL ERROR DETECTED:', event.error);

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

  return null;
};

export default ErrorMonitor;
