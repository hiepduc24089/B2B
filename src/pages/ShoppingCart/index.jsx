import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ShoppingCart.module.scss';
import { Link } from 'react-router-dom';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import { imagesCart } from '~/assets/images';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import LoadingIndicator from '~/components/Loading';
import routesConfig from '~/config/routes';
import { useCart } from '~/context/CartContext';
import { getShoppingCard } from '~/api/payment';

const cx = classNames.bind(styles);
const BASE_URL = 'https://api-b2b.krmedi.vn';

function ShoppingCart() {
  const [state, setState] = React.useState({
    loading: true,
    groupedProducts: {},
    quantities: {},
    checkedStores: {},
    checkedProducts: {},
  });

  const { checkedProducts, setCheckedProducts, quantities, setQuantities } = useCart();
  const { loading, groupedProducts, checkedStores } = state;

  // Group products by shop_id
  const groupProductsByShopId = (cart) => {
    const grouped = {};
    cart.forEach((shop) => {
      grouped[shop.shop_id] = {
        shop_name: shop.shop_name,
        products: shop.products,
      };
    });
    return grouped;
  };

  // Fetch product data
  const fetchDataProduct = async () => {
    try {
      const shoppingCart = await getShoppingCard();
      const groupedProducts = groupProductsByShopId(shoppingCart.cart);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        groupedProducts,
      }));
    } catch (error) {
      console.error('Error fetching shopping cart:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        groupedProducts: {},
      }));
    }
  };

  useEffect(() => {
    fetchDataProduct();
  }, []);

  // Handle store checkbox change
  const handleStoreCheckboxChange = (storeId) => {
    const isStoreChecked = !checkedStores[storeId];

    setState((prevState) => {
      const updatedCheckedStores = {
        ...prevState.checkedStores,
        [storeId]: isStoreChecked,
      };

      const updatedCheckedProducts = { ...prevState.checkedProducts };
      const products = prevState.groupedProducts[storeId]?.products || [];

      products.forEach((product) => {
        updatedCheckedProducts[product.product_id] = isStoreChecked;
      });

      return {
        ...prevState,
        checkedStores: updatedCheckedStores,
        checkedProducts: updatedCheckedProducts,
      };
    });
  };

  // Handle product checkbox change
  const handleProductCheckboxChange = (storeId, productId) => {
    const isProductChecked = !checkedProducts[productId];

    setState((prevState) => {
      const updatedCheckedProducts = {
        ...prevState.checkedProducts,
        [productId]: isProductChecked,
      };

      const storeProducts = prevState.groupedProducts[storeId]?.products || [];
      const allProductsChecked = storeProducts.every((product) => updatedCheckedProducts[product.product_id]);

      const updatedCheckedStores = {
        ...prevState.checkedStores,
        [storeId]: allProductsChecked,
      };

      return {
        ...prevState,
        checkedProducts: updatedCheckedProducts,
        checkedStores: updatedCheckedStores,
      };
    });
  };

  // Format price with thousands separator
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Calculate total price of selected products
  const calculateTotalPrice = () => {
    return Object.values(groupedProducts).reduce((total, group) => {
      const products = group.products || [];
      return products.reduce((groupTotal, product) => {
        const quantity = quantities[product.product_id] || 1;
        const price = parseFloat(product.price) || 0;
        const isChecked = checkedProducts[product.product_id];

        if (isChecked) {
          return groupTotal + price * quantity;
        }
        return groupTotal;
      }, total);
    }, 0);
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  // Render content
  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return Object.entries(groupedProducts).map(([storeId, { shop_name, products }]) => (
        <div key={storeId} className={cx('box-wrapper')}>
          <div className={cx('store-wrapper')}>
            <div className={cx('store-name')}>
              <input
                type="checkbox"
                className={cx('cart-checkbox')}
                id={`store-checkbox-${storeId}`}
                checked={checkedStores[storeId]} // Ensure checked state is boolean
                onChange={() => handleStoreCheckboxChange(storeId)}
              />
              <img src={imagesCart.store_icon} alt="Store Icon" />
              <h5>{shop_name || 'N/A'}</h5>
            </div>
            <img src={imagesCart.trash_icon} alt="Trash Icon" />
          </div>

          {products.map((product) => (
            <div key={product.product_id} className={cx('product-wrapper')}>
              <div className={cx('product-details', 'align-items-center', 'justify-content-between')}>
                <div className={cx('d-flex', 'align-items-center')}>
                  <input
                    type="checkbox"
                    className={cx('cart-checkbox')}
                    id={`product-checkbox-${product.product_id}`}
                    checked={checkedProducts[product.product_id]} // Ensure checked state is boolean
                    onChange={() => handleProductCheckboxChange(storeId, product.product_id)}
                  />
                  <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                    <img src={`${BASE_URL}${product.src[0]}`} alt="Product" className={cx('product-image')} />
                    <div style={{ marginLeft: '8px' }}>
                      <h5>{product.name}</h5>
                      <span className={cx('order-price')}>
                        Đơn giá:
                        <span className={cx('text-primary')}>{formatPrice(product.price)}đ</span>
                        <span className={cx('text-grey')}>/ Hộp</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={cx('text-right', 'quantity-trash')}>
                  <CustomInputNumber
                    min={1}
                    max={100}
                    initialValue={product.quantity || 1}
                    className={cx('custom-number')}
                    onValueChange={(newQuantity) => handleQuantityChange(product.product_id, newQuantity)}
                  />
                  <img src={imagesCart.trash_icon} alt="Trash Icon" className={cx('trash-icon')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ));
    }
  }

  return (
    <>
      <SubTitle />
      <div className={cx('shopping-cart-wrapper')}>
        <div className={cx('shopping-cart-details')}>
          <div className={cx('my-cart', 'box-wrapper')}>
            <h3 className={cx('title-h3')}>Giỏ hàng của tôi</h3>
            <p>Giỏ hàng hiện cho phép bạn đặt một hoặc nhiều đơn hàng từ một nhà cung cấp</p>
          </div>
          <div className={cx('list-store-wrapper')}>{renderContent()}</div>
        </div>

        <div className={cx('shopping-cart-payment', 'box-wrapper')}>
          <div className={cx('payment-wrapper')}>
            <h3 className={cx('title-h3')}>Tóm tắt đơn hàng</h3>
            <div className={cx('d-flex', 'justify-content-between')}>
              <span className={cx('title-payment')}>Tiền hàng</span>
              <span className={cx('price-payment')}>{formatPrice(calculateTotalPrice())} đ</span>
            </div>

            <Link
              to={{
                pathname: routesConfig.payment,
                state: { checkedProducts, quantities },
              }}
            >
              <button className={cx('submit-payment')}>Mua hàng</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ShoppingCart);
