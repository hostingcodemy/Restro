import { createContext, useContext, useState } from 'react';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {

  const [isMergeTable, setIsMergeTable] = useState(false);

  const [isSplitTable, setisSplitTable] = useState(false);




  return (
    <GeneralContext.Provider value={{ isMergeTable, setIsMergeTable, isSplitTable, setisSplitTable }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => useContext(GeneralContext);
