import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import FilterSearch from '~/components/Layout/FilterSearch';
import { Layout } from 'antd';
import { imagesHotDeal } from '~/assets/images';
import Product from './component/Product';
import { useLocation } from 'react-router-dom';
import { fetchCategoryProduct } from '~/api/category';

const cx = classNames.bind(styles);
const { Header, Content } = Layout;

function Category() {
  const location = useLocation();
  const { category_name, category_id } = location.state || {};

  const [state, setState] = useState({
    loading: true,
    dataListProduct: [],
  });
  const [filters, setFilters] = useState({
    categories: [category_id],
    cities: [],
    min_price: '',
    max_price: '',
  });
  useEffect(() => {
    if (category_id) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categories: [category_id],
      }));
    }
  }, [category_id]);
  const { loading, dataListProduct } = state;

  const userID = localStorage.getItem('user_id') || 0;

  useEffect(() => {
    const fetchData = async () => {
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const data = await fetchCategoryProduct(
          filters.categories,
          filters.cities,
          filters.min_price,
          filters.max_price,
          1,
          userID,
        );

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataListProduct: data.data.data,
        }));
      } catch (error) {
        console.error('Failed to fetch category product:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchData();
  }, [filters, userID]); // Fetch data when filters change

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <>
      <SubTitle title={category_name} />
      <Layout style={{ minHeight: '100vh', position: 'relative' }}>
        <FilterSearch category_id={category_id} onFilterChange={handleFilterChange} />
        <Layout className={cx('layout-right')}>
          <Header>
            <div className={cx('d-flex', 'align-items-center', 'product-notes')}>
              <img src={imagesHotDeal.check} alt="Check" />
              <span>Chính hãng 100%</span>
              <span>|</span>
              <img src={imagesHotDeal.change} alt="Change" />
              <span>Đổi trả hàng lỗi</span>
            </div>
          </Header>
          <Content className={cx('product')}>
            <Product loading={loading} dataListProduct={dataListProduct} category_name={category_name} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default memo(Category);
