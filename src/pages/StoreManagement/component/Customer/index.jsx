import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Customer.module.scss';
import { images } from '~/assets/images';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { getCustomer } from '~/api/store';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Customer() {
  const [state, setState] = useState({
    loading: true,
    dataCustomer: [],
  });

  const { loading, dataCustomer } = state;

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await getCustomer();
        setState({
          loading: false,
          dataCustomer: response.data.data, // Accessing the nested `data` array
        });
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchShopData();
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <>
      <div>
        <HeadlessTippy>
          <div className={cx('search')}>
            <input className={cx('search-field', 'form-control')} placeholder="Tìm kiếm theo tên" spellCheck={false} />
            <button className={cx('search-btn', 'd-flex')}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </HeadlessTippy>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('table-container')}>
          <table className={cx('table', 'table-vcenter', 'text-nowrap', 'table-customer')}>
            <tbody>
              {dataCustomer.map((customer, index) => (
                <tr key={index}>
                  <td className={cx('ps-0')}>
                    <div className={cx('infor-wrapper')}>
                      <img
                        src={customer.avatar ? `${API_HOST}${customer.avatar}` : images.avatar_icon}
                        alt={customer.name}
                        className={cx('customer-image')}
                      />
                      <div className={cx('name-wrapper')}>
                        <h5 className={cx('customer-name')}>{customer.name}</h5>
                        <p className={cx('customer-address')}>{customer.full_address}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cx('black-text', 'text-center')}>{customer.total_orders} đơn hàng</td>
                  <td className={cx('black-text', 'text-center')}>
                    {formatPrice(customer.total_spent)}đ đã thanh toán
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default memo(Customer);
