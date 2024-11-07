import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreInformation.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import { getShopByUser } from '~/api/store';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import { API_HOST } from '~/config/host';
import RelatedInformation from './component/RelatedInformation';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function StoreInformation() {
  const {
    setStoreHeaderVisibility,
    setStoreName,
    setStoreAddress,
    setStoreAvatar,
    setStoreID,
    setStoreIsFollow,
    setStoreFollowers,
    setStoreContacts,
    setStoreUserID,
  } = useStoreHeader();

  const location = useLocation();
  const { id } = useParams();
  const { shop_id } = location.state || {};
  const shopID = shop_id || id;

  useEffect(() => {
    setStoreHeaderVisibility(true);
    return () => setStoreHeaderVisibility(false);
  }, [setStoreHeaderVisibility]);

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
        setStoreName(data.name);
        setStoreAddress(data.sub_address);
        setStoreAvatar(data.avatar);
        setStoreID(shopID);
        setStoreIsFollow(data.is_follow ?? 0);
        setStoreFollowers(data.total_followers_shop ?? 0);
        setStoreContacts(data.total_contacts ?? 0);
        setStoreUserID(data.user_id);
      } catch (error) {
        console.error('Failed to fetch store information:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchShopData();
  }, [setStoreName, setStoreAddress, setStoreAvatar, setStoreID]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className={cx('store-wrapper')}>
        <img src={`${API_HOST}${dataStore.banner}`} alt={dataStore.name} className={cx('store-banner')} />
        <div className={cx('store-information')}>
          <div className={cx('related-information')}>
            <RelatedInformation dataStore={dataStore} shopID={shopID} />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(StoreInformation);
