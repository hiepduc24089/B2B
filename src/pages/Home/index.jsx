import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotDeal from './component/HotDeal';
import Banner from './component/Banner';
import Category from './component/Category';
import Supplier from './component/Supplier';
import Brand from './component/Brand';
import ForYou from './component/ForYou';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { imagesHome } from '~/assets/images';
import Success from '~/components/Layout/Popup/Success';
import New from './component/New';
import Echo from 'laravel-echo';
import { useAuth } from '~/context/AuthContext';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
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
      console.log('Received notification:', data);
    });

    return () => {
      window.Echo.leaveChannel(channelName);
    };
  }, [user]);

  useEffect(() => {
    if (location.state?.showSuccessPopup) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(location.pathname, { replace: true });
      }, 2000);
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <div className={cx('main')}>
        <div className={cx('banner')}>
          <Banner />
        </div>
        <div className={cx('hot-deal')}>
          <HotDeal />
        </div>
        <div className={cx('category')}>
          <Category />
        </div>
        <div className={cx('banner-ad')}>
          <img src={imagesHome.banner_big} alt="Banner Ad" />
        </div>
        <div className={cx('supplier')}>
          <Supplier />
        </div>
        <div className={cx('brand')}>
          <Brand />
        </div>
        <div className={cx('for-you')}>
          <New />
        </div>
        <div className={cx('for-you')}>
          <ForYou />
        </div>
      </div>

      {/* Show Success Popup */}
      {showSuccess && <Success message="Đăng nhập thành công" onClose={() => setShowSuccess(false)} />}
    </>
  );
}

export default Home;
