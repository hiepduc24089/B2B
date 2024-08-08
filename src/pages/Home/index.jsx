import HotDeal from './component/HotDeal';
import Banner from './component/Banner';
import Category from './component/Category';
import Supplier from './component/Supplier';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { imagesHome } from '~/assets/images';

const cx = classNames.bind(styles);

function Home() {
  return (
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
    </div>
  );
}

export default Home;
