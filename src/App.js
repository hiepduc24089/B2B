import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/Routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './components/PrivateRoute';
import LoginLayout from './components/LoginLayout';
import routesConfig from '~/config/routes';
import { setupInterceptors } from '~/axios/config';
import Popup from '~/components/PrivateRoute/component/Popup/Popup';
import StoreInformation from '~/pages/StoreInformation';
import StoreInformationMobile from '~/pages/StoreInformationMobile';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const handleUnauthorized = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    setupInterceptors(handleUnauthorized);

    // Function to update the state based on window size
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleBack = () => {
    setShowPopup(false);
  };

  const handleOk = () => {
    setShowPopup(false);
  };

  // Render routes
  const renderRoutes = (routes, isPrivate = false) => {
    return routes.map((route, index) => {
      const Page = route.component;
      let Layout = route.layout || DefaultLayout;

      // Check if the route is store_information
      if (route.path === routesConfig.store_information) {
        const PageComponent = isMobile ? StoreInformationMobile : StoreInformation;
        const LayoutComponent = isMobile ? LoginLayout : Layout;

        const element = (
          <LayoutComponent>
            <PageComponent />
          </LayoutComponent>
        );

        return (
          <Route key={index} path={route.path} element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element} />
        );
      }

      // Handle other routes
      if (
        route.path === routesConfig.login ||
        route.path === routesConfig.register ||
        route.path === routesConfig.select_password ||
        route.path === routesConfig.reset_password
      ) {
        Layout = LoginLayout;
      }

      const element = (
        <Layout>
          <Page />
        </Layout>
      );

      return (
        <Route key={index} path={route.path} element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element} />
      );
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {renderRoutes(publicRoutes)}
          {renderRoutes(privateRoutes, true)}
        </Routes>
        {showPopup && (
          <Popup
            message="Đăng nhập trước khi thực hiện bước này."
            onClose={handlePopupClose}
            onBack={handleBack}
            onOk={handleOk}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
