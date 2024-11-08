import React, { useEffect, useState } from 'react';
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
import { fetchBanner } from '~/api/home';

const cx = classNames.bind(styles);

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [loadedComponents, setLoadedComponents] = useState({
    hotDeal: false,
    category: false,
    supplier: false,
    brand: false,
    new: false,
    forYou: false,
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerData = await fetchBanner();
        setBanners(bannerData);
      } catch (error) {
        console.error('Error fetching banner:', error);
      } finally {
        setLoadingBanner(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (!user) return; // Ensure user is defined before proceeding

    const initializeEcho = async () => {
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
      try {
        const channel = window.Echo.private(channelName);
        channel.listen('.user-notification', (data) => {
          console.log('Received notification:', data);
        });
      } catch (error) {
        console.error('Error initializing Echo channel:', error);
      }
    };

    initializeEcho();

    return () => {
      if (window.Echo) {
        window.Echo.leaveChannel(`notifications.${user.id}`);
      }
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

  useEffect(() => {
    const loadComponent = async (componentKey, delay) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setLoadedComponents((prev) => ({ ...prev, [componentKey]: true }));
    };

    (async () => {
      await loadComponent('hotDeal', 500);
      await loadComponent('category', 500);
      await loadComponent('supplier', 500);
      await loadComponent('brand', 500);
      await loadComponent('new', 500);
      await loadComponent('forYou', 500);
    })();
  }, []);

  // Filter banners based on location
  const bannersForBannerComponent = banners.filter((banner) => banner.location === 1 || banner.location === 2);
  const bannerAd = banners.find((banner) => banner.location === 3);

  return (
    <>
      <div className={cx('main')}>
        <div className={cx('banner')}>
          <Banner banners={bannersForBannerComponent} loading={loadingBanner} />
        </div>
        {loadedComponents.hotDeal && (
          <div className={cx('hot-deal')}>
            <HotDeal />
          </div>
        )}
        {loadedComponents.category && (
          <div className={cx('category')}>
            <Category />
          </div>
        )}
        <div className={cx('banner-ad')}>
          {bannerAd ? (
            <img src={`${API_HOST}${bannerAd.src}`} alt="Banner Ad" />
          ) : (
            <img src={imagesHome.banner_big} alt="Banner Ad" />
          )}
        </div>
        {loadedComponents.supplier && (
          <div className={cx('supplier')}>
            <Supplier />
          </div>
        )}
        {loadedComponents.brand && (
          <div className={cx('brand')}>
            <Brand />
          </div>
        )}
        {loadedComponents.new && (
          <div className={cx('for-you')}>
            <New />
          </div>
        )}
        {loadedComponents.forYou && (
          <div className={cx('for-you')}>
            <ForYou />
          </div>
        )}
      </div>

      {/* Show Success Popup */}
      {showSuccess && <Success message="Đăng nhập thành công" onClose={() => setShowSuccess(false)} />}
    </>
  );
}

export default Home;
