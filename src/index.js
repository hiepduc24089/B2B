import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreHeaderProvider } from './context/StoreHeaderContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { NotificationProvider } from './context/NotificationProvider';
import { CheckOnlineProvider } from './context/CheckOnlineProvider';
import AnalyticsComponent from './components/GA4';

const RootApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <StoreHeaderProvider>
      <CartProvider>
        <AnalyticsComponent />
        {isAuthenticated ? (
          <StoreDataProvider>
            <NotificationProvider>
              <CheckOnlineProvider>
                <App />
              </CheckOnlineProvider>
            </NotificationProvider>
          </StoreDataProvider>
        ) : (
          <App />
        )}
      </CartProvider>
    </StoreHeaderProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RootApp />
  </AuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
