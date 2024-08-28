import React, { useEffect, memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome, imagesHotDeal } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { fetchCategory } from '~/api/home';

const cx = classNames.bind(styles);

const BASE_URL = 'https://api-b2b.krmedi.vn';

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
          <div key={index} className={cx('cate-item')}>
            <img src={`${BASE_URL}${category.src}`} alt={category.name} />
            <h3>{category.name}</h3>
            <p>{category.product_count} sản phẩm</p>
          </div>
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
