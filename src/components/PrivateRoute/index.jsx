import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import routesConfig from '~/config/routes';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to={routesConfig.login} />;
}

export default PrivateRoute;
