import React, { useEffect, memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { imagesHome, imagesHotDeal } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { fetchAllListCategory } from '~/api/requestsupplier';

const cx = classNames.bind(styles);

function Category() {
  const [state, setState] = useState({
    loading: true,
    dataListCategory: [],
  });
  const { loading, dataListCategory } = state;
  const [showFullList, setShowFullList] = useState(false);

  useEffect(() => {
    fetchDataListCategoryAPI();
  }, []);

  const fetchDataListCategoryAPI = async () => {
    try {
      const data = await fetchAllListCategory();
      setState({
        loading: false,
        dataListCategory: data.data,
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
            <Link
              key={index}
              to={`${routesConfig.category.replace(':slug', category.slug).replace(':id', category.id)}`}
              state={{ category_id: category.id, category_name: category.name }}
            >
              <div className={cx('category-item')}>
                <img src={`${API_HOST}${category.src}`} alt={category.name} />
                <h3>{category.name}</h3>
                <p>{category.product_count} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  const handleSeeAll = () => {
    setShowFullList(true);
  };

  const handleCloseSeeAll = () => {
    setShowFullList(false);
  };

  const renderSeeAllContent = () => (
    <div className={cx('see-all-wrapper')}>
      <div className={cx('header')}>
        <h1>Nhóm thuốc</h1>
        <img src={imagesHotDeal.close_icon} alt="Close" className={cx('close')} onClick={handleCloseSeeAll} />
      </div>
      <div className={cx('cate-wrapper')}>
        {dataListCategory.map((category, index) => (
          <Link
            key={index}
            to={`${routesConfig.category.replace(':slug', category.slug).replace(':id', category.id)}`}
            state={{ category_id: category.id }}
          >
            <div className={cx('cate-item')}>
              <img src={`${API_HOST}${category.src}`} alt={category.name} />
              <h3>{category.name}</h3>
              <p>{category.product_count} sản phẩm</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <h1>Nhóm thuốc</h1>
          <div className={cx('see-all')} onClick={handleSeeAll}>
            <p>
              Xem tất cả
              <img src={imagesHome.see_all} alt="See All Icon" />
            </p>
          </div>
        </div>
      </div>
      {renderContent()}
      {showFullList && (
        <div className={cx('overlay')} onClick={handleCloseSeeAll}>
          <div className={cx('sidebar')} onClick={(e) => e.stopPropagation()}>
            {renderSeeAllContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Category);
