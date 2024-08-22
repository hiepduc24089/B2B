import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ShoppingCart.module.scss';
import { Link } from 'react-router-dom';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import { imagesCart } from '~/assets/images';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { dataProduct } from '~/pages/Home/data/product';
import { dataSeller } from '~/data/seller';
import LoadingIndicator from '~/components/Loading';
import routesConfig from '~/config/routes';
import { useCart } from '~/context/CartContext';

const cx = classNames.bind(styles);

function ShoppingCart() {
  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
    quantities: {},
    checkedStores: {},
    checkedProducts: {},
  });
  const { checkedProducts, setCheckedProducts, quantities, setQuantities } = useCart();
  const { loading, dataListProduct, checkedStores } = state;

  // Function to group products by store_id
  const groupProductsByStore = (products) => {
    return products.reduce((result, product) => {
      const { store_id } = product;
      if (!result[store_id]) {
        result[store_id] = [];
      }
      result[store_id].push(product);
      return result;
    }, {});
  };

  //Fetch Product Data
  const fetchDataListProductAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListProduct: dataProduct,
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchDataListProductAPI();
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Calculate the total price of all products
  const calculateTotalPrice = () => {
    return dataListProduct.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      const price = parseFloat(product.price) || 0;
      const isChecked = checkedProducts[product.id];

      if (isChecked) {
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  //Handle + or - quantity of product
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  //Handle checkbox
  const handleStoreCheckboxChange = (storeId) => {
    const isChecked = !checkedStores[storeId];
    const productsInStore = groupProductsByStore(dataListProduct)[storeId];

    const updatedCheckedProducts = { ...checkedProducts };

    productsInStore.forEach((product) => {
      updatedCheckedProducts[product.id] = isChecked;
    });

    setCheckedProducts(updatedCheckedProducts);

    setState((prevState) => ({
      ...prevState,
      checkedStores: {
        ...prevState.checkedStores,
        [storeId]: isChecked,
      },
      // Synchronize local state with context
      checkedProducts: updatedCheckedProducts,
    }));
  };

  const handleProductCheckboxChange = (storeId, productId) => {
    const isChecked = !checkedProducts[productId];

    setCheckedProducts((prevCheckedProducts) => ({
      ...prevCheckedProducts,
      [productId]: isChecked,
    }));

    setState((prevState) => {
      const updatedCheckedProducts = {
        ...prevState.checkedProducts,
        [productId]: isChecked,
      };

      const productsInStore = groupProductsByStore(dataListProduct)[storeId];
      const allProductsChecked = productsInStore.every((product) => updatedCheckedProducts[product.id]);

      return {
        ...prevState,
        checkedProducts: updatedCheckedProducts,
        checkedStores: {
          ...prevState.checkedStores,
          [storeId]: allProductsChecked, // Only uncheck store if not all products are checked
        },
      };
    });
  };
  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      // Group products by store_id
      const groupedProducts = groupProductsByStore(dataListProduct);

      return Object.entries(groupedProducts).map(([storeId, products]) => {
        // Find the seller data by storeId
        const seller = dataSeller.find((seller) => seller.id === parseInt(storeId));

        return (
          <div key={storeId} className={cx('box-wrapper')}>
            <div className={cx('store-wrapper')}>
              <div className={cx('store-name')}>
                <input
                  type="checkbox"
                  className={cx('cart-checkbox')}
                  checked={checkedStores[storeId] || false}
                  onChange={() => handleStoreCheckboxChange(storeId)}
                  id="store-checkbox"
                />
                <img src={imagesCart.store_icon} alt="Store Icon" />
                <h5>{seller?.name || 'N/A'}</h5>
              </div>
              <img src={imagesCart.trash_icon} alt="Trash Icon" />
            </div>

            {products.map((product) => (
              <div key={product.id} className={cx('product-wrapper')}>
                <div className={cx('product-details', 'align-items-center', 'justify-content-between')}>
                  <div className={cx('d-flex', 'align-items-center')}>
                    <input
                      type="checkbox"
                      className={cx('cart-checkbox')}
                      checked={checkedProducts[product.id] || false}
                      onChange={() => handleProductCheckboxChange(storeId, product.id)}
                      id="product-checkbox"
                    />
                    <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                      <img src={product.image || imagesCart.store_icon} alt="Product" className={cx('product-image')} />
                      <div style={{ marginLeft: '8px' }}>
                        <h5>{product.title}</h5>
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
                      max={product.remaining}
                      initialValue={quantities[product.id] || 1}
                      className={cx('custom-number')}
                      onValueChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                    />
                    <img src={imagesCart.trash_icon} alt="Trash Icon" className={cx('trash-icon')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      });
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
