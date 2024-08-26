import React, { useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import { dataCategory } from '../data/category';
import routesConfig from '~/config/routes';
import LoadingIndicator from '~/components/Loading';
import { fetchCategory } from '~/api/home';

const cx = classNames.bind(styles);

const BASE_URL = 'https://api-b2b.krmedi.vn';

function Category() {
  const [state, setState] = React.useState({
    loading: true,
    dataListCategory: [],
  });
  const { loading, dataListCategory } = state;

  useEffect(() => {
    fetchDataListCategoryAPI();
  }, []);

  const fetchDataListCategoryAPI = async () => {
    try {
      const data = await fetchCategory();

      setState({
        loading: false,
        dataListCategory: data.data.data,
      });
    } catch (error) {
      console.error('Error fetching category data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('category-wrapper')}>
          {dataListCategory.map((category, index) => (
            <div key={index} className={cx('category-item')}>
              <img src={`${BASE_URL}${category.src}`} alt={category.name} />
              <h3>{category.name}</h3>
              <p>{category.product_count} sản phẩm</p>
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
