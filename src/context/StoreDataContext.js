// StoreDataContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getProfileShop } from '~/api/store';

const StoreDataContext = createContext();

export const StoreDataProvider = ({ children }) => {
  const [dataShop, setDataShop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataProfileShop = async () => {
      try {
        const dataResponse = await getProfileShop();
        setDataShop(dataResponse.data || []);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProfileShop();
  }, []);

  return <StoreDataContext.Provider value={{ dataShop, loading }}>{children}</StoreDataContext.Provider>;
};

export const useStoreData = () => useContext(StoreDataContext) || { dataShop: [], loading: true };
