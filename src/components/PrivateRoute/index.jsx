import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import routesConfig from '~/config/routes';
import Popup from '~/components/PrivateRoute/component/Popup/Popup';

function PrivateRoute({ children }) {
  const { user } = useAuth(); // Get the user from the auth context
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [user]);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleBack = () => {
    setShowPopup(false);
    navigate(-1);
  };

  const handleOk = () => {
    setShowPopup(false);
    navigate(routesConfig.login);
  };

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
