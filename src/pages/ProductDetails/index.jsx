import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetails.module.scss';
import Details from './component/Details';
import Store from './component/Store';
import { useParams } from 'react-router-dom';
import RelatedProduct from './component/RelatedProduct';
import RelatedInformation from './component/RelatedInformation';
import { dataProduct } from '~/pages/Home/data/product';
import { dataSeller } from '~/data/seller';

const cx = classNames.bind(styles);

function ProductDetails() {
  const { slug, id } = useParams();

  const [state, setState] = useState({
    loading: true,
    seller: null,
    product: null,
  });

  const { loading, seller, product } = state;

  useEffect(() => {
    fetchData();
  }, [slug, id]);

  const fetchData = async () => {
    setTimeout(() => {
      // Fetch product details
      const selectedProduct = dataProduct.find((product) => product.id === parseInt(id) && product.slug === slug);

      // Fetch seller details if the product exists
      const selectedSeller = selectedProduct
        ? dataSeller.find((seller) => seller.id === selectedProduct.store_id)
        : null;

      // Update state with product and seller details
      setState({
        loading: false,
        product: selectedProduct,
        seller: selectedSeller,
      });
    }, 1000);
  };

  return (
    <>
      <div className={cx('product-wrapper')}>
        <div className={cx('product-details')}>
          <Details product={product} loading={loading} />
        </div>
        <div className={cx('store-details')}>
          <Store seller={seller} loading={loading} />
        </div>
      </div>
      <div className={cx('related-information')}>
        <RelatedInformation
          productOverview={product ? product.overview : ''}
          storeOverview={seller ? seller.overview : ''}
        />
      </div>
      <div className={cx('related-product')}>
        <RelatedProduct />
      </div>
    </>
  );
}

export default memo(ProductDetails);
