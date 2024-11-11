import React, { useEffect, useState } from 'react';
import Header from '~/components/Layout/Header/Header';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Footer from '../Layout/Footer/Footer';
import StoreHeader from '~/components/Layout/StoreHeader';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import Chat from '../Layout/Chat';
import { getSettingPage } from '~/api/home';
import LoadingIndicator from '../Loading';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const { isStoreHeaderVisible } = useStoreHeader();
  const [setting, setSetting] = useState(null);
  const [clientSupport, setClientSupport] = useState(null);
  const [aboutUs, setAboutUs] = useState(null);
  const [cooperationAsociation, setCooperationAsociation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const settingData = await getSettingPage();
        setSetting(settingData.setting);
        setClientSupport(settingData.client_support);
        setAboutUs(settingData.about_us);
        setCooperationAsociation(settingData.cooperation_association);
      } catch (error) {
        console.error('Error fetching setting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={cx('wrapper')}>
      <Header setting={setting} />
      <Chat />
      {isStoreHeaderVisible && <StoreHeader />}
      <div className={cx('container')}>
        <div className={cx('content')}>{children}</div>
      </div>
      <Footer
        setting={setting}
        clientSupport={clientSupport}
        aboutUs={aboutUs}
        cooperationAsociation={cooperationAsociation}
      />
    </div>
  );
}

export default DefaultLayout;
