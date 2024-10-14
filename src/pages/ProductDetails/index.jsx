import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetails.module.scss';
import Details from './component/Details';
import Store from './component/Store';
import { useParams } from 'react-router-dom';
import RelatedProduct from './component/RelatedProduct';
import RelatedInformation from './component/RelatedInformation';
import { fetchProductDetails, fetchShopDetails } from '~/api/product';
import { useStoreHeader } from '~/context/StoreHeaderContext';

const cx = classNames.bind(styles);

function ProductDetails() {
  const { setStoreHeaderVisibility, setStoreName, setStoreAddress, setStoreAvatar, setStoreID, setStoreIsFollow } =
    useStoreHeader();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check screen width on initial load

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setStoreHeaderVisibility(true);
    } else {
      setStoreHeaderVisibility(false);
    }

    return () => {
      setStoreHeaderVisibility(false); // Cleanup to hide StoreHeader when unmounting
    };
  }, [isDesktop, setStoreHeaderVisibility]);

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
  const userID = localStorage.getItem('user_id') || 0;

  useEffect(() => {
    fetchData();
  }, [slug, id, userID]);

  const fetchData = async () => {
    try {
      const selectedProduct = await fetchProductDetails(slug, userID);
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

        setStoreName(shopDetails.name);
        setStoreAddress(shopDetails.sub_address);
        setStoreAvatar(shopDetails.avatar);
        setStoreID(shopDetails.id);
        setStoreIsFollow(shopDetails.is_follow ?? 0);
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
