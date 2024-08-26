import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetails.module.scss';
import Details from './component/Details';
import Store from './component/Store';
import { useParams } from 'react-router-dom';
import RelatedProduct from './component/RelatedProduct';
import RelatedInformation from './component/RelatedInformation';
import { fetchProductDetails, fetchShopDetails } from '~/api/product';

const cx = classNames.bind(styles);

function ProductDetails() {
  const { slug, id } = useParams();

  const [state, setState] = useState({
    loading: true,
    seller: null,
    product: null,
    recommendProduct: [],
    relatedProduct: [],
    viewedProduct: [],
  });

  const { loading, seller, product, recommendProduct, relatedProduct, viewedProduct } = state;

  useEffect(() => {
    fetchData();
  }, [slug, id]);

  const fetchData = async () => {
    try {
      const selectedProduct = await fetchProductDetails(slug);

      if (selectedProduct && selectedProduct.product) {
        const shopId = selectedProduct.product.shop_id;

        // Fetch shop details using shop_id
        const shopDetails = await fetchShopDetails(shopId);

        // Update state with product and shop details
        setState({
          loading: false,
          product: selectedProduct.product,
          seller: shopDetails,
          recommendProduct: selectedProduct.products_recommended || [],
          relatedProduct: selectedProduct.products_similar || [],
          viewedProduct: selectedProduct.products_viewed || [],
        });
      } else {
        setState({
          loading: false,
          product: null,
          seller: null,
          recommendProduct: [],
          relatedProduct: [],
          viewedProduct: [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch product or shop details:', error);
      setState({
        loading: false,
        product: null,
        seller: null,
        recommendProduct: [],
        relatedProduct: [],
        viewedProduct: [],
      });
    }
  };

  return (
    <>
      <div className={cx('product-wrapper')}>
        <div className={cx('product-details')}>
          <Details product={product} loading={loading} seller={seller} />
        </div>
        <div className={cx('store-details')}>
          <Store seller={seller} product={product} loading={loading} />
        </div>
      </div>
      <div className={cx('related-information')}>
        <RelatedInformation
          productOverview={product ? product.describe : ''}
          storeOverview={product ? product.shop_content : ''}
        />
      </div>
      {!loading && (
        <div className={cx('related-product')}>
          <RelatedProduct
            recommendedProduct={recommendProduct}
            relatedProduct={relatedProduct}
            viewedProduct={viewedProduct}
          />
        </div>
      )}
    </>
  );
}

export default memo(ProductDetails);
