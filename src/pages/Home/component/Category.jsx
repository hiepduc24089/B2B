import React, { useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import { dataCategory } from '../data/category';
import routesConfig from '~/config/routes';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Category() {
  const [state, setState] = React.useState({
    loading: true,
    dataListCategory: [],
  });
  const { loading, dataListCategory } = state;
  useEffect(() => {
    fetchDataListCategoryAPI();
    return () => {};
  }, []);

  const fetchDataListCategoryAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListCategory: dataCategory,
      }));
    }, 1000);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('category-wrapper')}>
          {dataListCategory.map((category, index) => (
            <div key={index} className={cx('category-item')}>
              <img src={category.image} alt={category.category_name} />
              <h3>{category.category_name}</h3>
              <p>{category.category_quantity} sản phẩm</p>
            </div>
          ))}
        </div>
      );
    }
  };
  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <h1>Nhóm thuốc</h1>
          <Link to={routesConfig.category} className={cx('see-all')}>
            <p>
              Xem tất cả
              <img src={imagesHome.see_all} alt="See All Icon" />
            </p>
          </Link>
        </div>
      </div>
      {renderContent()}
    </>
  );
}

export default memo(Category);
