import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_HOST } from '~/config/host';

const CheckOnlineContext = createContext();

export const useCheckOnline = () => useContext(CheckOnlineContext);

export const CheckOnlineProvider = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    const url = `${API_HOST}/api/check-online`;

    // Set user online status to 1 on page access
    const setUserOnline = async () => {
      if (user) {
        try {
          await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_online: 1, user_id: user.id }),
          });
        } catch (error) {
          console.error('Error setting user online:', error);
        }
      }
    };

    // Call function to set user online on component mount
    setUserOnline();

    // Handle before unload to set user offline
    const handleBeforeUnload = () => {
      const data = JSON.stringify({ is_online: 0, user_id: user.id });
      navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return <CheckOnlineContext.Provider value={{}}>{children}</CheckOnlineContext.Provider>;
};
