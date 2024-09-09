import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreInformationMobile.module.scss';
import { getShopByUser } from '~/api/store';
import { useLocation, useParams } from 'react-router-dom';
import { API_HOST } from '~/config/host';
import { images } from '~/assets/images';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from '~/components/Loading';
import RelatedInformation from '../StoreInformation/component/RelatedInformation';

const cx = classNames.bind(styles);

function StoreInformationMobile() {
  const location = useLocation();
  const { id } = useParams();
  const { shop_id } = location.state || {};
  const shopID = shop_id || id;

  const [state, setState] = React.useState({
    loading: true,
    dataStore: [],
  });

  const { loading, dataStore } = state;

  //Get Shop Details
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const data = await getShopByUser(shopID);

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataStore: data,
        }));
      } catch (error) {
        console.error('Failed to fetch store information:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchShopData();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className={cx('store-header')}>
        <div className={cx('image-wrapper')}>
          <img src={`${API_HOST}${dataStore.banner}`} alt={dataStore.name} className={cx('store-banner')} />
        </div>
        <div className={cx('search-field-wrapper')}>
          <div className={cx('container')}>
            <div className={cx('wrapper')}>
              <img src={images.backIcon} alt="Back" className={cx('back-icon')} />
              <HeadlessTippy>
                <div className={cx('search')}>
                  <input
                    className={cx('search-field', 'form-control')}
                    placeholder="Tìm trong gian hàng"
                    spellCheck={false}
                  />
                  <button className={cx('search-btn', 'd-flex')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </HeadlessTippy>
            </div>
          </div>
        </div>
        <div className={cx('store-details')}>
          <div className={cx('container')}>
            <div className={cx('wrapper')}>
              <div className={cx('store-infor')}>
                <img src={`${API_HOST}${dataStore.avatar}`} alt="Avatar" className={cx('store-avatar')} />
                <div>
                  <h3 className={cx('name')}>{dataStore.name || 'N/A'}</h3>
                  <p className={cx('location')}>{dataStore.sub_address || 'N/A'}</p>
                  <span className={cx('follower')}>
                    <span className={cx('fw-bold-600', 'text-primary')}>38</span> Theo dõi
                  </span>
                </div>
              </div>
              <div className={cx('store-button')}>
                <div className={cx('follow')}>
                  <img src={images.follow} alt="Follow" />
                  <button>Theo dõi</button>
                </div>
                <div className={cx('see-phone')}>
                  <img src={images.callIconWhite} alt="Phone" />
                  <button>Xem SĐT</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('store-strategy-wrapper')}>
          <div className={cx('container')}>
            <div className={cx('store-strategy')}>
              <div className={cx('province')}>
                <img src={images.locationIcon} alt="Location Icon" />
                <span className={cx('text')}>{dataStore.sub_address}</span>
              </div>
              <div className={cx('contact')}>
                <span className={cx('contact-static')}>106</span>
                <span className={cx('text')}>Liên hệ</span>
              </div>
              <div className={cx('response')}>
                <span className={cx('response-static')}>50%</span>
                <span className={cx('text')}>Phản hồi</span>
              </div>
            </div>
          </div>
        </div>
        <RelatedInformation dataStore={dataStore} shopID={shopID} />
      </div>
    </>
  );
}

export default memo(StoreInformationMobile);
