import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find(i => i.itemId === item.itemId);

      if (exists) {
        const updatedItems = prev.map(i =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      } else {
        const newItem = { ...item, quantity: 1 };
        const updatedItems = [...prev, newItem];
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedItems = prev.filter(i => i.itemId !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prev) => {
      const updatedItems = prev.map(item =>
        item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      const updatedItems = prev.map(item => {
        if (item.itemId === itemId) {
          const newQty = Math.max(item.quantity - 1, 1);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{
      setCartItems,
      addToCart,
      removeFromCart,
      cartItems,
      increaseQuantity,
      decreaseQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
