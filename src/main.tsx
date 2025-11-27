import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppWrapper from './AppWrapper';
import './index.css';

// Production-only entry point - now with proper routing
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
