import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreHeader.module.scss';
import { images } from '~/assets/images';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import { API_HOST } from '~/config/host';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { postCheckFollowShop, postFollowShop } from '~/api/product';
import { postUnfollowShop } from '~/api/profile';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function StoreHeader() {
  const { storeName, storeAddress, storeAvatar, storeID, storeIsFollow } = useStoreHeader();

  const [showSuccessFollow, setShowSuccessFollow] = useState(false);
  const [showSuccessUnfollow, setShowSuccessUnfollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const userID = localStorage.getItem('user_id') || 0;
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

  const handleFollowShop = async (shopId) => {
    try {
      const followResponse = await postFollowShop(shopId);
      if (followResponse.status) {
        setShowSuccessFollow(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert('Theo dõi shop thất bại.');
      }
    } catch (error) {
      console.error('Error follow shop:', error);
      alert('Theo dõi shop thất bại');
    }
  };

  const handleUnfollowShop = async (shopId) => {
    try {
      const unfollowResponse = await postUnfollowShop(shopId);
      if (unfollowResponse.status) {
        setShowSuccessUnfollow(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert('Bỏ theo dõi thất bại.');
      }
    } catch (error) {
      console.error('Error unfollowing shop:', error);
      alert('Bỏ theo dõi thất bại');
    }
  };

  return (
    <div className={cx('store-header')}>
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
                <span className={cx('fw-bold-600')}>38</span> Theo dõi
              </span>
              <span>
                <span className={cx('fw-bold-600')}>106</span> Liên hệ
              </span>
              <span>
                <span className={cx('fw-bold-600')}>50%</span> Phản hồi
              </span>
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
            <div className={cx('see-phone')}>
              <img src={images.phone} alt="Phone" />
              <button>Xem SĐT</button>
            </div>
          </div>
        </div>
      </div>
      {/* Show Success Popup */}
      {showSuccessFollow && <Success message="Theo dõi shop thành công" onClose={() => setShowSuccessFollow(false)} />}
      {showSuccessUnfollow && (
        <Success message="Bỏ theo dõi shop thành công" onClose={() => setShowSuccessUnfollow(false)} />
      )}
    </div>
  );
}

export default memo(StoreHeader);
