import React, { useEffect, useState, memo } from 'react';
import { Checkbox, Input, Layout } from 'antd';
import { dataCities } from '~/pages/Home/data/cities';
import { dataCategory } from '~/pages/Home/data/category';
import LoadingIndicator from '~/components/Loading';
import classNames from 'classnames/bind';
import styles from './FilterSearch.module.scss';
import { imagesHotDeal } from '~/assets/images';

const cx = classNames.bind(styles);

const { Sider } = Layout;

function FilterSearch() {
  const [state, setState] = React.useState({
    loading: true,
    dataListCategory: [],
    dataListCity: [],
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { loading, dataListCategory, dataListCity } = state;

  useEffect(() => {
    fetchDataListCategoryAPI();
    fetchDataListCityAPI();
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

  const fetchDataListCityAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListCity: dataCities,
      }));
    }, 1000);
  };

  const renderCategory = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <Checkbox.Group className={cx('checkbox-groups')}>
          {dataListCategory.slice(0, 10).map((category, index) => (
            <Checkbox key={index} value={category.category_name} className={cx('w-100')}>
              {category.category_name}
            </Checkbox>
          ))}
          <a href="#" className={cx('see-more')}>
            Xem thêm
          </a>
        </Checkbox.Group>
      );
    }
  };

  const renderCity = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <Checkbox.Group className={cx('checkbox-groups')}>
          {dataListCity.slice(0, 6).map((city, index) => (
            <Checkbox key={index} value={city.province} className={cx('w-100')}>
              {city.province}
            </Checkbox>
          ))}
          <a href="#" className={cx('see-more')}>
            Xem thêm
          </a>
        </Checkbox.Group>
      );
    }
  };

  return (
    <Sider className={cx('search-wrapper')} width={'25%'} style={{ background: 'var(--white)' }}>
      <div className={cx('filter-group')}>
        <h3 className={cx('desktop')}>Bộ lọc tìm kiếm</h3>
        <button className={cx('mobile', 'button-filter')} onClick={() => setIsFilterVisible(!isFilterVisible)}>
          <img src={imagesHotDeal.filter} alt="Filter" />
          Bộ lọc
        </button>
        {isFilterVisible && (
          <div className={cx('mobile-filter')}>
            <div className={cx('d-flex', 'justify-content-between', 'align-items-center', 'mb-5')}>
              <h3 className={cx('mb-0')}>Bộ lọc tìm kiếm</h3>
              <span className={cx('close-btn')} onClick={() => setIsFilterVisible(!isFilterVisible)}>
                <img src={imagesHotDeal.close_icon} alt="close" />
              </span>
            </div>
            <div className={cx('filter-section')}>
              <h4>Nhóm thuốc</h4>
              {renderCategory()}
            </div>
            <div className={cx('filter-section')}>
              <h4>Tỉnh / Thành</h4>
              {renderCity()}
            </div>
            <div className={cx('filter-section')}>
              <h4>Khoảng giá</h4>
              <div className={cx('price-range')}>
                <Input type="number" placeholder="Từ" className={cx('price-input')} />
                <span className={cx('separator')}>-</span>
                <Input type="number" placeholder="Đến" className={cx('price-input')} />
              </div>
            </div>
            <div className={cx('d-flex', 'justify-content-center')}>
              <button className={cx('button-apply')}>Áp dụng</button>
            </div>
          </div>
        )}
        <div className={cx('desktop')}>
          <div className={cx('filter-section')}>
            <h4>Nhóm thuốc</h4>
            {renderCategory()}
          </div>
          <div className={cx('filter-section')}>
            <h4>Tỉnh / Thành</h4>
            {renderCity()}
          </div>
          <div className={cx('filter-section')}>
            <h4>Khoảng giá</h4>
            <div className={cx('price-range')}>
              <Input type="number" placeholder="Từ" className={cx('price-input')} />
              <span className={cx('separator')}>-</span>
              <Input type="number" placeholder="Đến" className={cx('price-input')} />
            </div>
          </div>
          <div className={cx('d-flex', 'justify-content-center')}>
            <button className={cx('button-apply')}>Áp dụng</button>
          </div>
        </div>
      </div>
    </Sider>
  );
}

export default memo(FilterSearch);
