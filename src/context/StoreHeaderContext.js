// src/contexts/StoreHeaderContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context
const StoreHeaderContext = createContext();

// Provider Component
export function StoreHeaderProvider({ children }) {
  const [isStoreHeaderVisible, setStoreHeaderVisibility] = useState(false);

  return (
    <StoreHeaderContext.Provider value={{ isStoreHeaderVisible, setStoreHeaderVisibility }}>
      {children}
    </StoreHeaderContext.Provider>
  );
}

// Custom Hook to use the StoreHeader Context
export function useStoreHeader() {
  return useContext(StoreHeaderContext);
}
