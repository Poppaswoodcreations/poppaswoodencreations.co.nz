import { useState, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('poppas-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('poppas-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { id: product.id, product, quantity }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('poppas-cart');
  };

  const getCartTotal = () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartWeight = () => cart.reduce((total, item) => total + (item.product.weight || 0.5) * item.quantity, 0);

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount, getCartWeight };
};
