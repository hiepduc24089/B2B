import classNames from 'classnames/bind';
import styles from './SubTitle.module.scss';
import { imagesHome } from '~/assets/images';
import routesConfig from '~/config/routes';
import { useLocation, Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SubTitle({ title }) {
  const location = useLocation();

  const pathToSubTitleMap = {
    [routesConfig.profile]: 'Thông tin tài khoản',
    [routesConfig.hot_deal]: 'Deal Hot hôm nay',
    [routesConfig.foryou]: 'Dành cho bạn',
    [routesConfig.supplier]: 'Tìm nhà cung cấp',
    [routesConfig.shopping_cart]: 'Giỏ hàng',
    [routesConfig.store_management]: 'Quản lý gian hàng',
    [routesConfig.footer_blog]: 'Chi tiết bài viết',
  };

  const subtitle = pathToSubTitleMap[location.pathname] || title;

  return (
    <div className={cx('sub-title')}>
      <Link to={routesConfig.home}>Trang chủ</Link>
      <span className={cx('d-flex', 'align-items-center', 'next-icon')}>
        <img src={imagesHome.see_all} alt="See All" width={10} height={10} />
      </span>
      {subtitle}
    </div>
  );
}

export default SubTitle;
