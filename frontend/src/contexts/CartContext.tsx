import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Course } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(prev => {
      const exists = prev.find(item => item.courseId === course.id);
      if (exists) return prev;
      
      return [...prev, {
        courseId: course.id,
        course,
        addedAt: new Date()
      }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems(prev => prev.filter(item => item.courseId !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.course.price, 0);
  const itemCount = items.length;

  const value = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};