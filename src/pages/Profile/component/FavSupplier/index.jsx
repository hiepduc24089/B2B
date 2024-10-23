import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './FavSupplier.module.scss';
import { imagesSeller } from '~/assets/images';
import { fetchFollowingShop, postUnfollowShop } from '~/api/profile';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function FavSupplier() {
  const [showSuccess, setShowSuccess] = useState(false);

  const [state, setState] = useState({
    loading: true,
    dataFollowingShop: null,
  });
  const { loading, dataFollowingShop } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFollowingShop();
        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataFollowingShop: data.data.data,
        }));
      } catch (error) {
        console.error('Failed to fetch following:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchData();
  }, []);

  const handleUnfollow = async (shopId) => {
    try {
      const unfollowResponse = await postUnfollowShop(shopId);
      if (unfollowResponse.status) {
        setShowSuccess(true);
        setState((prevState) => ({
          ...prevState,
          dataFollowingShop: prevState.dataFollowingShop.filter((shop) => shop.id !== shopId),
        }));
      } else {
        alert('Bỏ theo dõi thất bại.');
      }
    } catch (error) {
      console.error('Error unfollowing shop:', error);
      alert('Bỏ theo dõi thất bại');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={cx('supplier-wrapper')}>
      {dataFollowingShop && dataFollowingShop.length > 0 ? (
        dataFollowingShop.map((shop, index) => (
          <div key={index} className={cx('supplier-item-wrapper')}>
            <div className={cx('infor-wrapper')}>
              <img src={`${API_HOST}${shop.avatar}`} alt={shop.name} className={cx('shop-image')} />
              <div className={cx('name-wrapper')}>
                <h5 className={cx('shop-name')}>{shop.name}</h5>
                <p className={cx('shop-address')}>{shop.full_address}</p>
              </div>
            </div>
            <button className={cx('unfollow-btn')} onClick={() => handleUnfollow(shop.id)}>
              Bỏ theo dõi
            </button>
          </div>
        ))
      ) : (
        <p className={cx('no-data')}>Không có nhà cung cấp nào bạn đang theo dõi</p>
      )}
      {/* Show Success Popup */}
      {showSuccess && <Success message="Bỏ theo dõi shop thành công" onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

export default memo(FavSupplier);
