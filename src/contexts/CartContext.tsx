import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course } from '@/data/courses';

interface CartItem extends Course {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('healthmed-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('healthmed-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === course.id);
      if (existing) {
        return prev;
      }
      return [...prev, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems(prev => prev.filter(item => item.id !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: string) => {
    return items.some(item => item.id === courseId);
  };

  const totalItems = items.length;

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
