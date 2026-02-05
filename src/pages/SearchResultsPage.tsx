import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchResultsPage: React.FC = () => {
  const handleShowAdmin = () => {
    console.log('Admin clicked');
  };

  const handleShowCart = () => {
    console.log('Cart clicked');
  };

  return (
    <>
      <Header 
        onShowAdmin={handleShowAdmin}
        onShowCart={handleShowCart}
        cartItemCount={0}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600">SEARCH PAGE IS WORKING!</h1>
        <p className="text-2xl mt-4">If you can see this, the route works.</p>
      </div>
      
      <Footer />
    </>
  );
};

export default SearchResultsPage;
