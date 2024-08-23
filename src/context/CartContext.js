import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [checkedProducts, setCheckedProducts] = useState({});
  const [quantities, setQuantities] = useState({});

  return (
    <CartContext.Provider value={{ checkedProducts, setCheckedProducts, quantities, setQuantities }}>
      {children}
    </CartContext.Provider>
  );
};
