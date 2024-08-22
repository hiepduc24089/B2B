import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import routesConfig from '~/config/routes';
import Popup from '~/components/PrivateRoute/component/Popup/Popup';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleBack = () => {
    setShowPopup(false);
    navigate(-1); // Go back to the previous route
  };

  const handleOk = () => {
    setShowPopup(false);
    navigate(routesConfig.login); // Navigate to the login route
  };

  if (!isAuthenticated && !showPopup) {
    setShowPopup(true);
  }

  if (showPopup) {
    return (
      <Popup
        message="Đăng nhập trước khi thực hiện bước này."
        onClose={handlePopupClose}
        onBack={handleBack}
        onOk={handleOk}
      />
    );
  }

  return children;
}

export default PrivateRoute;
