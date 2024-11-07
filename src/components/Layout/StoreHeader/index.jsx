import React, { memo, useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreHeader.module.scss';
import { images } from '~/assets/images';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import { API_HOST } from '~/config/host';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { postCheckFollowShop, postFollowShop } from '~/api/product';
import { postUnfollowShop } from '~/api/profile';
import Success from '~/components/Layout/Popup/Success';
import LoadingIndicator from '~/components/Loading';
import Failed from '../Popup/Failed';
import ChatOpen from '../ChatOpen';
import { useAuth } from '~/context/AuthContext';
import { createConversations } from '~/api/chat';
import Warning from '../Popup/Warning';

const cx = classNames.bind(styles);

function StoreHeader() {
  const { storeName, storeAddress, storeAvatar, storeID, storeIsFollow, storeFollowers, storeContacts, storeUserID } =
    useStoreHeader();
  const location = useLocation();
  const navigate = useNavigate();
  const storeHeaderRef = useRef(null);

  const { user } = useAuth();
  const { isAuthenticated } = useAuth();

  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showSuccessFollow, setShowSuccessFollow] = useState(false);
  const [showSuccessUnfollow, setShowSuccessUnfollow] = useState(false);
  const [showErrorFollow, setShowErrorFollow] = useState(false);
  const [showErrorUnfollow, setShowErrorUnfollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [warningAuthenticate, setWarningAuthenticate] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [showErrorStartChat, setShowErrorStartChat] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('/product')) {
      const handleScroll = () => {
        if (storeHeaderRef.current) {
          if (window.scrollY > 200) {
            storeHeaderRef.current.classList.add(cx('visible'));
          } else {
            storeHeaderRef.current.classList.remove(cx('visible'));
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await postCheckFollowShop(storeID, userID);
        if (response.status) {
          setIsFollowing(response.data);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    if (storeID) {
      checkFollowStatus();
    }
  }, [storeID]);

  const userID = localStorage.getItem('user_id') || 0;

  const handleFollowShop = async (shopId) => {
    setLoadingFullScreen(true);
    try {
      const followResponse = await postFollowShop(shopId);
      if (followResponse.status) {
        setShowSuccessFollow(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setShowErrorFollow(true);
      }
    } catch (error) {
      console.error('Error following shop:', error);
      setShowErrorFollow(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const handleUnfollowShop = async (shopId) => {
    setLoadingFullScreen(true);
    try {
      const unfollowResponse = await postUnfollowShop(shopId);
      if (unfollowResponse.status) {
        setShowSuccessUnfollow(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setShowErrorUnfollow(true);
      }
    } catch (error) {
      console.error('Error unfollowing shop:', error);
      setShowErrorUnfollow(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const handleChatButtonClick = async () => {
    if (!isAuthenticated) {
      setWarningAuthenticate(true);
      return;
    }
    if (user.id === storeUserID) {
      return;
    }
    setLoadingFullScreen(true);
    try {
      const response = await createConversations(user.id, storeUserID);
      if (response && response.status) {
        setConversation(response.data);
        setIsChatOpen(true);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setShowErrorStartChat(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div
        className={location.pathname.includes('/product') ? cx('store-header-hide') : cx('store-header-show')}
        ref={storeHeaderRef}
      >
        <div className={cx('container')}>
          <div className={cx('store-wrapper')}>
            <div className={cx('store-details')}>
              <Link
                to={{
                  pathname: `${routesConfig.store_information.replace(':id', storeID)}`,
                }}
                state={{ shop_id: storeID }}
              >
                <div className={cx('store-infor')}>
                  <img src={`${API_HOST}${storeAvatar}`} alt="Avatar" />
                  <div>
                    <h3 className={cx('name')}>{storeName || 'N/A'}</h3>
                    <p className={cx('location')}>{storeAddress || 'N/A'}</p>
                  </div>
                </div>
              </Link>
              <div className={cx('store-followers')}>
                <span>
                  <span className={cx('fw-bold-600')}>{storeFollowers}</span> Theo dõi
                </span>
                <span>
                  <span className={cx('fw-bold-600')}>{storeContacts}</span> Liên hệ
                </span>
                {/* <span>
                  <span className={cx('fw-bold-600')}>50%</span> Phản hồi
                </span> */}
              </div>
            </div>
            <div className={cx('store-button')}>
              {!isFollowing ? (
                <div className={cx('follow')} onClick={() => handleFollowShop(storeID)}>
                  <img src={images.follow} alt="Follow" />
                  <button>Theo dõi</button>
                </div>
              ) : (
                <div className={cx('unfollow')} onClick={() => handleUnfollowShop(storeID)}>
                  <button>Bỏ theo dõi</button>
                </div>
              )}
              <div className={cx('see-phone')} onClick={handleChatButtonClick}>
                <img src={images.phone} alt="Phone" />
                <button>Nhắn tin</button>
              </div>
              {isChatOpen && conversation && (
                <ChatOpen
                  userId={user.id}
                  receiverId={storeUserID}
                  conversationId={conversation.id}
                  onClose={() => setIsChatOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Show Success Popup */}
      {showSuccessFollow && <Success message="Theo dõi shop thành công" onClose={() => setShowSuccessFollow(false)} />}
      {showSuccessUnfollow && (
        <Success message="Bỏ theo dõi shop thành công" onClose={() => setShowSuccessUnfollow(false)} />
      )}
      {showErrorFollow && <Failed message="Theo dõi shop thất bại" onClose={() => setShowErrorFollow(false)} />}
      {showErrorUnfollow && <Failed message="Bỏ theo dõi shop thất bại" onClose={() => setShowErrorUnfollow(false)} />}
      {showErrorStartChat && (
        <Failed message="Không thể bắt đầu cuộc trò chuyện" onClose={() => setShowErrorStartChat(false)} />
      )}
      {warningAuthenticate && (
        <Warning
          message="Vui lòng đăng nhập để thực hiện chức năng này"
          onClose={() => setWarningAuthenticate(false)}
          onOk={() => navigate(routesConfig.login)}
        />
      )}
    </>
  );
}

export default memo(StoreHeader);
