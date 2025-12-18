import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const AppWrapper: React.FC = () => {
  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

export default AppWrapper;
