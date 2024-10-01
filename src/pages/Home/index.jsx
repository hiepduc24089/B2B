import { useEffect, useState } from 'react';
import HotDeal from './component/HotDeal';
import Banner from './component/Banner';
import Category from './component/Category';
import Supplier from './component/Supplier';
import Brand from './component/Brand';
import ForYou from './component/ForYou';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { imagesHome } from '~/assets/images';
import { useLocation } from 'react-router-dom';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.showSuccessPopup) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
  }, [location.state]);

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
          <ForYou />
        </div>
      </div>

      {/* Show Success Popup */}
      {showSuccess && <Success message="Đăng nhập thành công" onClose={() => setShowSuccess(false)} />}
    </>
  );
}

export default Home;
