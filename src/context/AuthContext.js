import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchProfile } from '~/api/profile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const isTokenExpired = (token) => {
    if (!token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    }
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = tokenPayload.exp * 1000;
    if (Date.now() > expiryTime) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    }
    return false;
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        try {
          const response = await fetchProfile();
          if (isTokenExpired(storedToken) || response.data.token !== storedToken) {
            logout();
          } else {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error validating token with API:', error);
          logout();
        }
      } else {
        logout();
      }
    };

    checkTokenValidity();
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
