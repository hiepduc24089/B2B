import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SupplierPrice.module.scss';
import { fetchListPriceQuote } from '~/api/requestsupplier';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function SupplierPrice() {
  const [state, setState] = useState({
    loading: true,
    dataPriceQuote: [],
  });

  const { loading, dataPriceQuote } = state;

  // Move fetchRequest function to the component scope
  const fetchPriceQuote = async (page = 1) => {
    try {
      const getPriceQuoteResponse = await fetchListPriceQuote(page);

      if (!getPriceQuoteResponse.status) {
        alert('Lấy thông tin báo giá thất bại, vui lòng thử lại');
        return;
      }

      setState({
        loading: false,
        dataPriceQuote: getPriceQuoteResponse.data.data,
      });
    } catch (error) {
      console.error('Fetch price quote:', error);
      alert('Lấy thông tin báo giá thất bại, vui lòng thử lại');
    }
  };

  useEffect(() => {
    fetchPriceQuote();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('price-quote-wrapper')}>
          {dataPriceQuote.map((quote, index) => (
            <div key={index} className={cx('list-quote')}>
              <div className={cx('infor-wrapper')}>
                <img
                  src={`${API_HOST}${quote.request_src[1]}`}
                  alt={quote.request_name}
                  className={cx('quote-image')}
                />
                <div className={cx('information')}>
                  <span className={cx('text-grey')}>
                    Số lượng mua: <span className={cx('text-black')}>{quote.request_quantity}</span>
                  </span>
                  <span className={cx('text-grey', 'price')}>
                    Giá: <span className={cx('text-black')}>{quote.price}</span>
                  </span>
                  <span className={cx('text-grey', 'content')}>
                    Bài đăng: <span className={cx('text-black')}>{quote.content}</span>
                  </span>
                </div>
              </div>
              <button className={cx('show-detail')}>Xem chi tiết</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default memo(SupplierPrice);
