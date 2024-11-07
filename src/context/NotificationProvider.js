import React, { useEffect, createContext, useContext, useState } from 'react';
import Echo from 'laravel-echo';
import { useAuth } from './AuthContext';
import { API_HOST } from '~/config/host';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'bd72b2f14ad121b7671a',
      cluster: 'ap1',
      forceTLS: true,
      authEndpoint: `${API_HOST}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });

    const channelName = `notifications.${user.id}`;
    const channel = window.Echo.private(channelName);

    channel.listen('.user-notification', (data) => {
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    });
    return () => {
      window.Echo.leaveChannel(channelName);
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>{children}</NotificationContext.Provider>
  );
};
