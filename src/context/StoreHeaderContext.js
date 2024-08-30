// src/contexts/StoreHeaderContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context
const StoreHeaderContext = createContext();

// Provider Component
export function StoreHeaderProvider({ children }) {
  const [isStoreHeaderVisible, setStoreHeaderVisibility] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeAvatar, setStoreAvatar] = useState('');
  const [storeID, setStoreID] = useState('');

  return (
    <StoreHeaderContext.Provider
      value={{
        isStoreHeaderVisible,
        setStoreHeaderVisibility,
        storeName,
        setStoreName,
        storeAddress,
        setStoreAddress,
        storeAvatar,
        setStoreAvatar,
        storeID,
        setStoreID,
      }}
    >
      {children}
    </StoreHeaderContext.Provider>
  );
}

// Custom Hook to use the StoreHeader Context
export function useStoreHeader() {
  return useContext(StoreHeaderContext);
}
