import React, { memo, useState } from 'react';
import { Layout } from 'antd';
import FilterSearch from '~/components/Layout/FilterSearch';
import Product from './component/Product';
import classNames from 'classnames/bind';
import styles from './HotDeal.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import { imagesHotDeal } from '~/assets/images';

const cx = classNames.bind(styles);

const { Header, Content } = Layout;

function HotDeal() {
  const [filters, setFilters] = useState({
    categories: [],
    cities: [],
    min_price: '',
    max_price: '',
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  return (
    <>
      <SubTitle />
      <Layout style={{ minHeight: '100vh', position: 'relative' }}>
        <FilterSearch onFilterChange={handleFilterChange} />
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
            <Product filters={filters} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default memo(HotDeal);
