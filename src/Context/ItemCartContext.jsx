import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  const [addonItem, setAddonItem] = useState([])

  const [currentTableId, setCurrentTableId] = useState(null);

  const addToCart = (item) => {
    const selectedPrice = item.prices?.[0];

    const addonKey = (item.addonItems?.items || [])
      .map(a => `${a.itemId}_${a.itemSizeId}_${a.itemQuantity}`)
      .join("|");

    const uniqueKey = `${item.itemId}_${selectedPrice.itemSizeId}_${addonKey}_${item.remarks || ""}`;

    const newItem = {
      ...item,
      prices: [selectedPrice],
      quantity: item.quantity || 1,
      uniqueKey,
      prefix: "V",
      isDisabled: false,
    };

    const currentStoredTableId = localStorage.getItem("currentTableId");

    if (currentStoredTableId && currentStoredTableId !== currentTableId) {
      // Different table selected, reset cart
      setCartItems([newItem]);
      localStorage.setItem("cartItems", JSON.stringify([newItem]));
      localStorage.setItem("currentTableId", currentTableId);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find(i => i.uniqueKey === uniqueKey && !i.isDisabled);

      if (exists) {
        const updatedItems = prev.map(i =>
          i.uniqueKey === uniqueKey && !i.isDisabled
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      } else {
        const indexToInsert = prev.findIndex(i => i.isDisabled);
        const updatedItems = indexToInsert !== -1
          ? [...prev.slice(0, indexToInsert), newItem, ...prev.slice(indexToInsert)]
          : [...prev, newItem];

        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      }
    });
  };


  const removeFromCart = (uniqueKey) => {
    setCartItems((prev) => {
      const updatedItems = prev.filter(i => i.uniqueKey !== uniqueKey);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const increaseQuantity = (uniqueKey) => {
    setCartItems((prev) => {
      const updatedItems = prev.map(item =>
        item.uniqueKey === uniqueKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const decreaseQuantity = (uniqueKey) => {
    setCartItems((prev) => {
      const updatedItems = prev.map(item => {
        if (item.uniqueKey === uniqueKey) {
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

  const loadKotItems = (runningOrders = [], tableId = null) => {
    const kotItems = [];

    runningOrders.forEach(order => {
      const itemMasterList = order.item || [];
      const kotNumber = order.kotNumber;

      (order.orderDetails || []).forEach(detail => {
        const uniqueKey = `${detail.itemId}_${detail.sizeId}_kot_${kotNumber}`;

        const matchedItem = itemMasterList.find(i => i.itemId === detail.itemId);
        const itemTaxes = matchedItem?.taxes || [];
        const itemImage = matchedItem?.itemImage || "";

        const item = {
          itemId: detail.itemId,
          itemName: detail.itemName,
          itemImage,
          quantity: detail.qty,
          prices: [{
            itemSizeId: detail.sizeId,
            itemSizeName: detail.sizeName,
            itemPrice: detail.rate,
            uomId: detail.uomId
          }],
          remarks: detail.itemRemarks || "",
          addonItems: {
            items: (detail.addonList || []).map(addon => ({
              itemId: addon.addonItemID,
              itemName: addon.itemName,
              itemQuantity: addon.qty,
              itemPrice: addon.rate,
              itemSizeName: addon.sizeName,
              uomId: addon.uomId,
              sizeId: addon.sizeId
            }))
          },
          uniqueKey,
          taxes: itemTaxes,
          isDisabled: true,
          kotNumber,
          prefix: "O"
        };

        kotItems.push(item);
      });
    });

    setCurrentTableId(tableId);
    localStorage.setItem("currentTableId", tableId);
    setCartItems(kotItems);
    localStorage.setItem("cartItems", JSON.stringify(kotItems));
  };

  const confirmKot = (kotNumber) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.kotNumber === kotNumber
          ? { ...item, isDisabled: false, isUpdate: true, isKotConfirmed: true }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
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
      updateRemarks,
      loadKotItems,
      confirmKot
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
