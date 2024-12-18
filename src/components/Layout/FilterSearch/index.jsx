import React, { useEffect, useState, memo } from 'react';
import { Checkbox, Input, Layout } from 'antd';
import LoadingIndicator from '~/components/Loading';
import classNames from 'classnames/bind';
import styles from './FilterSearch.module.scss';
import { imagesHotDeal } from '~/assets/images';
import { fetchCategory } from '~/api/home';
import { fetchProvinces } from '~/api/province';

const cx = classNames.bind(styles);
const { Sider } = Layout;

function FilterSearch({ category_id, onFilterChange }) {
  const [state, setState] = useState({
    loading: true,
    dataListCategory: [],
    dataListCity: [],
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(6);
  const [maxCitiesCount, setMaxCitiesCount] = useState(0);
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(10);
  const [maxCategoriesCount, setMaxCategoriesCount] = useState(0);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedCities, setCheckedCities] = useState([]);
  const [priceRange, setPriceRange] = useState({ min_price: '', max_price: '' });

  const { loading, dataListCategory, dataListCity } = state;

  useEffect(() => {
    fetchDataListCategoryAPI();
    fetchDataListCityAPI();
  }, []);

  useEffect(() => {
    if (category_id && !checkedCategories.includes(category_id)) {
      setCheckedCategories((prev) => [...prev, category_id]);
    }
  }, [category_id, checkedCategories]);

  const fetchDataListCategoryAPI = async () => {
    try {
      const listProductResponse = await fetchCategory();
      setMaxCategoriesCount(listProductResponse.data.data.length);

      const categories = listProductResponse.data.data || [];

      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListCategory: categories,
      }));
    } catch (error) {
      console.error('Error fetching category data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const fetchDataListCityAPI = async () => {
    try {
      const listCityResponse = await fetchProvinces();
      setMaxCitiesCount(listCityResponse.length);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListCity: listCityResponse || [],
      }));
    } catch (error) {
      console.error('Error fetching city data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  // Debounced price range update (triggered after 1 second of no change)
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [priceRange]);

  useEffect(() => {
    onFilterChange({ categories: checkedCategories, cities: checkedCities, ...debouncedPriceRange });
  }, [debouncedPriceRange, checkedCategories, checkedCities]);

  const handleCategoryChange = (checkedValues) => {
    setCheckedCategories(checkedValues);
  };

  const handleCityChange = (checkedValues) => {
    setCheckedCities(checkedValues);
  };

  const handlePriceChange = (field, value) => {
    setPriceRange((prev) => ({ ...prev, [field]: value }));
  };

  const renderCategory = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <Checkbox.Group className={cx('checkbox-groups')} value={checkedCategories} onChange={handleCategoryChange}>
          {dataListCategory.slice(0, visibleCategoriesCount).map((category) => (
            <Checkbox key={category.id} value={category.id} className={cx('w-100')}>
              {category.name}
            </Checkbox>
          ))}
          {visibleCategoriesCount > 10 && (
            <a
              href="#"
              className={cx('see-more')}
              onClick={() => setVisibleCategoriesCount((prevCount) => Math.max(prevCount - 10, 10))}
            >
              Ẩn bớt
            </a>
          )}
          {visibleCategoriesCount < maxCategoriesCount && (
            <a
              href="#"
              className={cx('see-more')}
              onClick={() => setVisibleCategoriesCount((prevCount) => Math.min(prevCount + 10, maxCategoriesCount))}
            >
              Xem thêm
            </a>
          )}
        </Checkbox.Group>
      );
    }
  };

  const renderCity = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <Checkbox.Group className={cx('checkbox-groups')} value={checkedCities} onChange={handleCityChange}>
          {dataListCity.slice(0, visibleCitiesCount).map((city) => (
            <Checkbox key={city.province_id} value={city.province_id} className={cx('w-100')}>
              {city.name}
            </Checkbox>
          ))}
          {visibleCitiesCount > 6 && (
            <a
              href="#"
              className={cx('see-more')}
              onClick={() => setVisibleCitiesCount((prevCount) => Math.max(prevCount - 15, 6))}
            >
              Ẩn bớt
            </a>
          )}
          {visibleCitiesCount < maxCitiesCount && (
            <a
              href="#"
              className={cx('see-more')}
              onClick={() => setVisibleCitiesCount((prevCount) => Math.min(prevCount + 15, maxCitiesCount))}
            >
              Xem thêm
            </a>
          )}
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
                <Input
                  type="number"
                  placeholder="Từ"
                  className={cx('price-input')}
                  value={priceRange.min_price}
                  onChange={(e) => handlePriceChange('min_price', e.target.value)}
                />
                <span className={cx('separator')}>-</span>
                <Input
                  type="number"
                  placeholder="Đến"
                  className={cx('price-input')}
                  value={priceRange.max_price}
                  onChange={(e) => handlePriceChange('max_price', e.target.value)}
                />
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
              <Input
                type="number"
                placeholder="Từ"
                className={cx('price-input')}
                value={priceRange.min_price}
                onChange={(e) => handlePriceChange('min_price', e.target.value)}
              />
              <span className={cx('separator')}>-</span>
              <Input
                type="number"
                placeholder="Đến"
                className={cx('price-input')}
                value={priceRange.max_price}
                onChange={(e) => handlePriceChange('max_price', e.target.value)}
              />
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
