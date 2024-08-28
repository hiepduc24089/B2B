import React, { memo, useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ShoppingCart.module.scss';
import { useNavigate } from 'react-router-dom';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import { imagesCart } from '~/assets/images';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import LoadingIndicator from '~/components/Loading';
import routesConfig from '~/config/routes';
import { useCart } from '~/context/CartContext';
import { getShoppingCard, createCheckOut, removeProductByShop, removeStore, updateCart } from '~/api/payment';

const cx = classNames.bind(styles);
const BASE_URL = 'https://api-b2b.krmedi.vn';

function ShoppingCart() {
  const { quantities, setQuantities } = useCart();
  const [state, setState] = useState({
    loading: true,
    groupedProducts: {},
  });
  const [checkedState, setCheckedState] = useState({});
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const { loading, groupedProducts } = state;

  // Debounce timeout ref to store the timer
  const debounceTimeout = useRef(null);

  // Handle quantity change with debouncing
  const handleQuantityChange = (storeId, productId, newQuantity) => {
    // Update the local state first
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));

    // Update groupedProducts state with the new quantity
    setState((prevState) => {
      const updatedGroupedProducts = { ...prevState.groupedProducts };
      const products = updatedGroupedProducts[storeId].products.map((product) =>
        product.product_id === productId ? { ...product, quantity: newQuantity } : product,
      );

      updatedGroupedProducts[storeId].products = products;
      return { ...prevState, groupedProducts: updatedGroupedProducts };
    });

    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to call the API after 1 second
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await updateCart({
          shop_id: storeId,
          product_id: productId,
          quantity: newQuantity,
        });

        if (!response.status) {
          alert('Cập nhật giỏ hàng thất bại, vui lòng thử lại.');

          // Revert the quantity change in the state if the update fails
          setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: quantities[productId], // revert to the previous quantity
          }));

          setState((prevState) => {
            const revertedGroupedProducts = { ...prevState.groupedProducts };
            const revertedProducts = revertedGroupedProducts[storeId].products.map((product) =>
              product.product_id === productId ? { ...product, quantity: quantities[productId] } : product,
            );

            revertedGroupedProducts[storeId].products = revertedProducts;
            return { ...prevState, groupedProducts: revertedGroupedProducts };
          });
        }
      } catch (error) {
        console.error('Failed to update product quantity:', error);
        alert('Failed to update product quantity. Please try again.');

        // Revert the quantity change in the state if the update fails
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: quantities[productId], // revert to the previous quantity
        }));

        setState((prevState) => {
          const revertedGroupedProducts = { ...prevState.groupedProducts };
          const revertedProducts = revertedGroupedProducts[storeId].products.map((product) =>
            product.product_id === productId ? { ...product, quantity: quantities[productId] } : product,
          );

          revertedGroupedProducts[storeId].products = revertedProducts;
          return { ...prevState, groupedProducts: revertedGroupedProducts };
        });
      }
    }, 1000);
  };

  // Handle removing a product
  const handleRemoveProduct = async (storeId, productId, quantity) => {
    const isConfirmed = window.confirm('Bạn có muốn xóa sản phẩm này không?');

    if (!isConfirmed) {
      return;
    }
    try {
      const removeProduct = await removeProductByShop({
        shop_id: storeId,
        product_id: productId,
        quantity: quantity,
      });
      if (!removeProduct.status) {
        alert('Xoá sản phẩm thất bại, vui lòng thử lại');
        return;
      }
      // Update state to remove the product from the UI
      setState((prevState) => {
        const updatedGroupedProducts = { ...prevState.groupedProducts };
        updatedGroupedProducts[storeId].products = updatedGroupedProducts[storeId].products.filter(
          (product) => product.product_id !== productId,
        );

        // If there are no products left for a store, remove the store entry
        if (updatedGroupedProducts[storeId].products.length === 0) {
          delete updatedGroupedProducts[storeId];
        }

        return { ...prevState, groupedProducts: updatedGroupedProducts };
      });

      setCheckedState((prevState) => {
        const updatedCheckedState = { ...prevState };
        delete updatedCheckedState[storeId]?.productChecked?.[productId];

        // If no products remain checked in the store, uncheck the store itself
        if (updatedCheckedState[storeId] && Object.keys(updatedCheckedState[storeId].productChecked).length === 0) {
          delete updatedCheckedState[storeId];
        }

        return updatedCheckedState;
      });
    } catch (error) {
      console.error('Failed to remove product:', error);
      alert('Failed to remove the product. Please try again.');
    }
  };

  // Handle removing a store
  const handleRemoveStore = async (storeId) => {
    const isConfirmed = window.confirm('Bạn có muốn xóa cửa hàng này không?');
    if (!isConfirmed) {
      return;
    }

    try {
      const responseRemoveStore = await removeStore({ shop_id: storeId });

      if (!responseRemoveStore.status) {
        alert('Xoá thất bại, vui lòng thử lại');
        return;
      }

      setState((prevState) => {
        const updatedGroupedProducts = { ...prevState.groupedProducts };
        delete updatedGroupedProducts[storeId];

        return { ...prevState, groupedProducts: updatedGroupedProducts };
      });

      setCheckedState((prevState) => {
        const updatedCheckedState = { ...prevState };
        delete updatedCheckedState[storeId];

        return updatedCheckedState;
      });
    } catch (error) {
      console.error('Failed to remove store:', error);
      alert('Failed to remove the store. Please try again.');
    }
  };

  // Handle store checkbox change
  const handleStoreCheckboxChange = (storeId) => {
    const isStoreChecked = checkedState[storeId]?.isStoreChecked || false;

    const updatedCheckedState = {
      ...checkedState,
      [storeId]: {
        isStoreChecked: !isStoreChecked,
        productChecked: groupedProducts[storeId].products.reduce((acc, product) => {
          acc[product.product_id] = !isStoreChecked;
          return acc;
        }, {}),
      },
    };

    setCheckedState(updatedCheckedState);
  };

  // Handle product checkbox change
  const handleProductCheckboxChange = (storeId, productId) => {
    const storeCheckedState = checkedState[storeId] || { isStoreChecked: false, productChecked: {} };
    const isProductChecked = storeCheckedState.productChecked[productId] || false;

    const updatedProductChecked = {
      ...storeCheckedState.productChecked,
      [productId]: !isProductChecked,
    };

    const allProductsChecked = Object.values(updatedProductChecked).every((checked) => checked);

    const updatedCheckedState = {
      ...checkedState,
      [storeId]: {
        isStoreChecked: allProductsChecked,
        productChecked: updatedProductChecked,
      },
    };

    setCheckedState(updatedCheckedState);
  };

  // Calculate total price of all checked products
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    Object.entries(groupedProducts).forEach(([storeId, { products }]) => {
      products.forEach((product) => {
        if (checkedState[storeId]?.productChecked?.[product.product_id]) {
          totalPrice += (product.price ?? 0) * (product.quantity ?? 1);
        }
      });
    });

    return totalPrice;
  };

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

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Handle checkout process
  const handleCheckout = async () => {
    const items = Object.entries(groupedProducts)
      .map(([storeId, { products }]) => ({
        shop_id: parseInt(storeId, 10),
        products: products
          .filter((product) => checkedState[storeId]?.productChecked?.[product.product_id])
          .map((product) => ({
            product_id: product.product_id,
            quantity: product.quantity,
          })),
      }))
      .filter((item) => item.products.length > 0);

    if (items.length === 0) {
      alert('Vui lòng chọn sản phẩm');
      return;
    }

    try {
      const checkoutResponse = await createCheckOut(items);

      if (!checkoutResponse.status) {
        alert('Mua hàng thất bại, vui lòng thử lại.');
        return;
      }
      navigate(routesConfig.payment, { state: { checkoutData: checkoutResponse.data } });
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Mua hàng thất bại, vui lòng thử lại.');
    }
  };

  // Format price with thousands separator
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
                checked={checkedState[storeId]?.isStoreChecked || false}
                onChange={() => handleStoreCheckboxChange(storeId)}
              />
              <img src={imagesCart.store_icon} alt="Store Icon" />
              <h5>{shop_name || 'N/A'}</h5>
            </div>
            <img
              src={imagesCart.trash_icon}
              alt="Trash Icon"
              className={cx('trash-icon')}
              onClick={() => handleRemoveStore(storeId)}
            />
          </div>

          {products.map((product) => (
            <div key={product.product_id} className={cx('product-wrapper')}>
              <div className={cx('product-details', 'align-items-center', 'justify-content-between')}>
                <div className={cx('d-flex', 'align-items-center')}>
                  <input
                    type="checkbox"
                    className={cx('cart-checkbox')}
                    id={`product-checkbox-${product.product_id}`}
                    checked={checkedState[storeId]?.productChecked?.[product.product_id] || false}
                    onChange={() => handleProductCheckboxChange(storeId, product.product_id)}
                  />
                  <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                    <img src={`${BASE_URL}${product.src[0]}`} alt="Product" className={cx('product-image')} />
                    <div style={{ marginLeft: '8px', minWidth: '250px' }}>
                      <h5>{product.name}</h5>
                      <span className={cx('order-price')}>
                        Đơn giá:
                        <span className={cx('text-primary')}>{formatPrice(product.price ?? 0)}đ</span>
                        <span className={cx('text-grey')}>/ Hộp</span>
                      </span>
                      <span className={cx('remaining', 'text-grey')}>
                        Tồn kho: <span className={cx('text-primary')}>{product.inventory_quantity ?? 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={cx('text-right', 'quantity-trash')}>
                  <CustomInputNumber
                    min={1}
                    max={product.inventory_quantity}
                    initialValue={product.quantity || 1}
                    className={cx('custom-number')}
                    onValueChange={(newQuantity) => handleQuantityChange(storeId, product.product_id, newQuantity)}
                  />
                  <img
                    src={imagesCart.trash_icon}
                    alt="Trash Icon"
                    className={cx('trash-icon')}
                    onClick={() => handleRemoveProduct(storeId, product.product_id, product.quantity)}
                  />
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

            <button className={cx('submit-payment')} onClick={handleCheckout}>
              Mua hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ShoppingCart);
