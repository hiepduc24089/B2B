import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './QuoteReceive.module.scss';
import { fetchListPriceQuote, fetchPriceQuoteDetail } from '~/api/requestsupplier';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';
import { imagesHotDeal } from '~/assets/images';
import { fetchQuoteSent } from '~/api/profile';

const cx = classNames.bind(styles);

function QuoteReceive() {
  const [state, setState] = useState({
    loadingPriceQuote: true,
    loadingQuoteDetail: true,
    dataPriceQuote: [],
    dataQuoteDetail: [],
    errorPriceQuote: null,
    errorQuoteDetail: null,
    showModal: false,
  });

  const {
    loadingPriceQuote,
    loadingQuoteDetail,
    dataPriceQuote,
    dataQuoteDetail,
    errorPriceQuote,
    errorQuoteDetail,
    showModal,
  } = state;

  // Common function to update state
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  // Fetch price quotes
  const fetchPriceQuote = async () => {
    try {
      const response = await fetchQuoteSent();
      if (!response.status) {
        throw new Error('Failed to fetch price quotes');
      }

      updateState({
        loadingPriceQuote: false,
        dataPriceQuote: response.data.data,
        errorPriceQuote: null,
      });
    } catch (error) {
      console.error('Fetch price quote error:', error);
      updateState({
        loadingPriceQuote: false,
        errorPriceQuote: 'Lấy thông tin báo giá thất bại, vui lòng thử lại',
      });
    }
  };

  // Fetch quote details
  const fetchQuoteDetail = async (id) => {
    try {
      const response = await fetchPriceQuoteDetail(id);
      if (!response.status) {
        throw new Error('Failed to fetch price quote details');
      }

      updateState({
        loadingQuoteDetail: false,
        dataQuoteDetail: response.data,
        showModal: true,
        errorQuoteDetail: null,
      });
    } catch (error) {
      console.error('Fetch quote detail error:', error);
      updateState({
        loadingQuoteDetail: false,
        errorQuoteDetail: 'Lấy thông tin báo giá chi tiết thất bại, vui lòng thử lại',
      });
    }
  };

  const handleShowDetail = (quoteId) => {
    fetchQuoteDetail(quoteId);
  };

  const handleCloseModal = () => {
    updateState({
      showModal: false,
      dataQuoteDetail: [],
    });
  };

  useEffect(() => {
    fetchPriceQuote();
  }, []);

  function formatPrice(price) {
    const validPrice = price ?? 0;
    return validPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const renderDetail = () => {
    if (loadingQuoteDetail) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('quote-wrapper')}>
          <div className={cx('header')}>
            <h1>Chi tiết báo giá</h1>
            <img src={imagesHotDeal.close_icon} alt="Close" className={cx('close')} onClick={handleCloseModal} />
          </div>
          <div className={cx('quote-detail-wrapper')}>
            <h3>{dataQuoteDetail.request_name}</h3>
            <div className={cx('w-100', 'double-input')}>
              <div>
                <label className={cx('label-field')}>Tên của bạn</label>
                <input type="text" value={dataQuoteDetail.name} className={cx('input-field')} readOnly />
              </div>
              <div>
                <label className={cx('label-field')}>Thông tin liên hệ của bạn</label>
                <input type="number" value={dataQuoteDetail.phone} className={cx('input-field')} readOnly />
              </div>
            </div>
            <div className={cx('single-input')}>
              <label className={cx('label-bold')}>Số lượng:</label>
              <span className={cx('input-bold')}>{dataQuoteDetail.request_quantity}</span>
            </div>
            <div className={cx('single-input')}>
              <label className={cx('label-bold')}>Giá đưa ra:</label>
              <span className={cx('input-bold')}>{formatPrice(dataQuoteDetail.price)} VNĐ</span>
            </div>
            <div className={cx('single-input', 'flex-wrap')}>
              <label className={cx('label-field', 'w-100')}>Địa chỉ</label>
              <input type="text" value={dataQuoteDetail.address} className={cx('input-field')} readOnly />
            </div>
            <div>
              <label className={cx('label-field')}>Lời nhắn </label>
              <textarea rows={4} className={cx('w-100', 'input-field')} readOnly>
                {dataQuoteDetail.content}
              </textarea>
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {loadingPriceQuote ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('price-quote-wrapper')}>
          {errorPriceQuote ? (
            <div className={cx('error-message')}>{errorPriceQuote}</div>
          ) : dataPriceQuote.length === 0 ? (
            <h5>Không có dữ liệu</h5>
          ) : (
            dataPriceQuote.map((quote, index) => (
              <div key={index} className={cx('list-quote')}>
                <div className={cx('infor-wrapper')}>
                  <img
                    src={`${API_HOST}${quote.request_src?.[1] || 'defaultImage.jpg'}`}
                    alt={quote.request_name}
                    className={cx('quote-image')}
                  />
                  <div className={cx('information')}>
                    <span className={cx('text-grey')}>
                      Số lượng mua: <span className={cx('text-black')}>{quote.request_quantity}</span>
                    </span>
                    <span className={cx('text-grey', 'price')}>
                      Giá: <span className={cx('text-black')}>{formatPrice(quote.price)} VNĐ</span>
                    </span>
                    <span className={cx('text-grey', 'content')}>
                      Bài đăng: <span className={cx('text-black')}>{quote.content}</span>
                    </span>
                  </div>
                </div>
                <button className={cx('show-detail')} onClick={() => handleShowDetail(quote.id)}>
                  Xem chi tiết
                </button>
              </div>
            ))
          )}
          {/* Modal for showing details */}
          {showModal && (
            <div className={cx('overlay')} onClick={handleCloseModal}>
              <div className={cx('sidebar')} onClick={(e) => e.stopPropagation()}>
                {renderDetail()}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default memo(QuoteReceive);
