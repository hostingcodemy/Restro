// TableSelectionContext.js
import React, { createContext, useContext, useState } from 'react';

const TableSelectionContext = createContext();

export const TransferProvider = ({ children }) => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedRightTables, setSelectedRightTables] = useState([]);
  const [transferMode, setTransferMode] = useState("table");
  const [selection, setSelection] = useState({});
  const [quantities, setQuantities] = useState({});



  const toggleTableSelection = (table) => {
    setSelectedTables(prev => {
      const exists = prev.find(t => t.tableId === table.tableId);
      return exists
        ? prev.filter(t => t.tableId !== table.tableId)
        : [...prev, table];
    });
  };


  const isChecked = (type, id) => selection[type]?.[id] ?? false;

  const toggleCheck = (type, id, parentData = {}) => {
    setSelection(prev => {
      const updated = { ...prev };
      updated[type] = { ...updated[type], [id]: !prev[type]?.[id] };

      const checked = !prev[type]?.[id]; // new checked state

      if (type === 'tables') {
        const kotList = parentData.kots || [];
        kotList.forEach(k => {
          // KOT check
          updated.kots = { ...updated.kots, [k.orderID]: checked };

          // Items under KOT
          k.orderDetails?.forEach(item => {
            updated.items = {
              ...updated.items,
              [item.itemId]: checked,
            };
          });
        });
      }

      if (type === 'kots') {
        const itemList = parentData.items || [];
        itemList.forEach(item => {
          updated.items = {
            ...updated.items,
            [item.itemId]: checked,
          };
        });
      }

      // item type doesn't affect other levels

      return updated;
    });
  };

  const changeQty = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

const handleSelectTable = (table) => {
  setSelectedRightTables(prev => {
    const isAlreadySelected = prev.some(t => t.tableId === table.tableId);

    if (transferMode === 'table') {
      // Single selection — clear or replace
      return isAlreadySelected ? [] : [table];
    } else {
      // Multi-select — toggle
      return isAlreadySelected
        ? prev.filter(t => t.tableId !== table.tableId)
        : [...prev, table];
    }
  });
};



  return (
    <TableSelectionContext.Provider
      value={{
        selectedTables,
        toggleTableSelection,
        selection,
        isChecked,
        toggleCheck,
        quantities,
        changeQty,
        handleSelectTable,
        transferMode,
        setTransferMode
      }}>
      {children}
    </TableSelectionContext.Provider>
  );
};

export const useTransferTable = () => useContext(TableSelectionContext);
