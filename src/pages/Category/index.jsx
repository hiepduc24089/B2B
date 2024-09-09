import React, { memo, useEffect } from 'react';
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

  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });

  const { loading, dataListProduct } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategoryProduct(category_id, '', '', '', 1);

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
  }, []);

  return (
    <>
      <SubTitle title={category_name} />
      <Layout style={{ minHeight: '100vh', position: 'relative' }}>
        <FilterSearch category_id={category_id} />
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
            <Product loading={loading} dataListProduct={dataListProduct} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default memo(Category);
