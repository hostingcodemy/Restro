import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState([]);

  const [addonItem, setAddonItem] = useState([])


console.log(cartItems);


const addToCart = (item, addons = []) => {
  const selectedPrice = item.prices?.[0]; // assume size is already filtered
  const uniqueKey = `${item.itemId}_${selectedPrice.itemSizeId}`;

  setCartItems((prev) => {
    const exists = prev.find(i => i.uniqueKey === uniqueKey);

    if (exists) {
      const updatedItems = prev.map(i =>
        i.uniqueKey === uniqueKey
          ? {
              ...i,
              quantity: i.quantity + item.quantity, // use quantity from popup
              // addonItems: i.addonItems || addons
            }
          : i
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    } else {
      const newItem = {
        ...item,
        prices: [selectedPrice], // only the selected size
        quantity: item.quantity || 1,
        uniqueKey, // for identifying unique size-item combo
        // addonItems: addons,
      };
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

  


  const increaseAddonQty = (itemId, addonId) => {
  setCartItems(prev =>
    prev.map(item => {
      if (item.itemId !== itemId) return item;

      const updatedAddons = item.addonItems.items.map(addon =>
        addon.itemId === addonId
          ? { ...addon, itemQuantity: (addon.itemQuantity || 1) + 1 }
          : addon
      );

      return { ...item, addonItems: { ...item.addonItems, items: updatedAddons } };
    })
  );
};

const decreaseAddonQty = (itemId, addonId) => {
  setCartItems(prev =>
    prev.map(item => {
      if (item.itemId !== itemId) return item;

      const updatedAddons = item.addonItems.items.map(addon =>
        addon.itemId === addonId
          ? { ...addon, itemQuantity: Math.max(1, (addon.itemQuantity || 1) - 1) }
          : addon
      );

      return { ...item, addonItems: { ...item.addonItems, items: updatedAddons } };
    })
  );
};



const updateRemarks = (itemId, value) => {
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item.itemId === itemId ? { ...item, remarks: value } : item
    )
  );
};



  return (
    <CartContext.Provider value={{
      setCartItems,
      addToCart,
      removeFromCart,
      cartItems,
      increaseQuantity,
      decreaseQuantity,
      setAddonItem,
      increaseAddonQty,
      decreaseAddonQty,
      updateRemarks
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
