import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NotificationPropper.module.scss';
import { getListNotification, getMarkReadNotification } from '~/api/notification';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { useNotification } from '~/context/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function NotificationPropper({ setIsLoadingFullscreen }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loadingListNoti: true,
    listNotification: [],
    pageNotifications: {}, // Store notifications by page
  });
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const { loadingListNoti, listNotification, pageNotifications } = state;
  const { notifications } = useNotification();
  const maxPage = 3; // Define max page here

  useEffect(() => {
    const fetchListNoti = async () => {
      try {
        const getListNotificationResponse = await getListNotification(currentPage);
        if (!getListNotificationResponse.status) {
          setState({
            loadingListNoti: false,
            listNotification: [],
          });
          return;
        }
        setState({
          loadingListNoti: false,
          listNotification: getListNotificationResponse.data.data,
          pageNotifications: { 1: getListNotificationResponse.data.data }, // Store page 1 notifications
        });
      } catch (error) {
        console.error('Fetch notifications failed:', error);
        alert('Lấy thông tin thông báo thất bại.');
        setState({
          loadingListNoti: false,
          listNotification: [],
        });
      }
    };

    fetchListNoti();
  }, []);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      listNotification: [...notifications, ...prevState.listNotification],
    }));
  }, [notifications]);

  const handleNotificationClick = async (notification) => {
    setIsLoadingFullscreen(true);
    try {
      await getMarkReadNotification(notification.id);

      setState((prevState) => ({
        ...prevState,
        listNotification: prevState.listNotification.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      }));
      if (notification.type === 'my-order') {
        navigate(routesConfig.profile, { state: { activeTab: 'MyOrder' } });
      } else {
        let activeTabFromNoti;
        switch (notification.type) {
          case 'ask-buy':
            activeTabFromNoti = 'Product-Ask';
            break;
          case 'product-report':
            activeTabFromNoti = 'Product-Reported';
            break;
          case 'create-order':
            activeTabFromNoti = 'Order';
            break;
          case 'create-quotes':
            activeTabFromNoti = 'Supplier-Price';
            break;
          default:
            activeTabFromNoti = '';
        }
        navigate(routesConfig.store_management, { state: { activeTabFromNoti } });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsLoadingFullscreen(false);
    }
  };

  const loadMoreNotifications = async () => {
    const nextPage = currentPage + 1;
    if (nextPage > maxPage) return; // Prevent going past max page

    try {
      const response = await getListNotification(nextPage);
      if (response.status) {
        setState((prevState) => ({
          ...prevState,
          listNotification: [...prevState.listNotification, ...response.data.data],
          pageNotifications: { ...prevState.pageNotifications, [nextPage]: response.data.data }, // Store each page's notifications
        }));
        setCurrentPage(nextPage); // Update the current page
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  };

  const showLessNotifications = () => {
    setCurrentPage(1);
    setState((prevState) => ({
      ...prevState,
      listNotification: prevState.pageNotifications[1] || [], // Show only page 1 notifications
    }));
  };

  return (
    <div className={cx('notification-wrapper')}>
      {loadingListNoti ? (
        <LoadingIndicator />
      ) : (
        <>
          {listNotification.length === 0 ? (
            <p className={cx('no-notifications')}>Không có thông báo</p>
          ) : (
            listNotification.map((notification) => (
              <div
                key={notification.id}
                className={cx('notification-item', {
                  'unread-notification': !notification.is_read,
                })}
                onClick={() => handleNotificationClick(notification)}
              >
                <img
                  src={`${API_HOST}${notification.sender_avatar}`}
                  alt={notification.sender_name}
                  className={cx('notification-avatar')}
                />
                <div className={cx('notification-content')}>
                  <h5 className={cx('sender-name')}>{notification.sender_name}</h5>
                  <p className={cx('sender-message')}>{notification.message}</p>
                </div>
                <div className={cx('unread-dot')}></div>
              </div>
            ))
          )}
        </>
      )}
      {listNotification.length > 0 && (
        <>
          {currentPage === 1 && (
            <div onClick={loadMoreNotifications} className={cx('load-more')}>
              Xem thêm
            </div>
          )}
          {currentPage === 2 && (
            <div className={cx('d-flex', 'justify-content-center', 'align-items-center')} style={{ gap: '10px' }}>
              <div onClick={showLessNotifications} className={cx('show-less')}>
                Ẩn bớt
              </div>
              <div onClick={loadMoreNotifications} className={cx('load-more')}>
                Xem thêm
              </div>
            </div>
          )}
          {currentPage === 3 && (
            <div onClick={showLessNotifications} className={cx('show-less')}>
              Ẩn bớt
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(NotificationPropper);
