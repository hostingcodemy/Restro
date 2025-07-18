import { createContext, useContext, useState } from 'react';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {

  const [isMergeTable, setIsMergeTable] = useState(false);

  const [isSplitTable, setisSplitTable] = useState(false);

  const [OrderBillPopUp, setOrderBillPopUp] = useState(false);

const normalize = (str) => (typeof str === "string" ? str.toLowerCase().replace(/\s+/g, "") : "");



  return (
    <GeneralContext.Provider value={{ isMergeTable, setIsMergeTable, isSplitTable, setisSplitTable, OrderBillPopUp, setOrderBillPopUp,normalize }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => useContext(GeneralContext);
