import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially set to false
  const [user, setUser] = useState(null); // State to store user data

  // Function to login and set user data
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Optionally, save user data to local storage to persist session
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  // Function to logout and clear user data
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Optionally, remove user data from local storage
    localStorage.removeItem('user');
  };

  // Effect to load user data from local storage if available (persisting login state)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
