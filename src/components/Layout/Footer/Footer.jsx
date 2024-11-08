import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Space } from 'antd';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { imagesFooter } from '~/assets/images';
import routesConfig from '~/config/routes';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;
const cx = classNames.bind(styles);

function Footer({ setting, clientSupport, aboutUs, cooperationAsociation }) {
  return (
    <div className={cx('container')}>
      <AntFooter className={cx('footer')}>
        <Row gutter={[16, 16]} className={cx('footer-wrapper')}>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Hỗ trợ khách hàng
            </Title>
            <Text className={cx('hotline')}>{setting.hotline}</Text>
            {clientSupport.map((item) => (
              <Link key={item.id} to={routesConfig.footer_blog.replace(':slug', item.slug)}>
                {item.name}
              </Link>
            ))}
            <Text className={cx('support')}>
              Hỗ trợ khách hàng:
              <a href={`mailto:${setting.customer_support_email || 'lienhe@krmedi.com'}`}>
                {setting.customer_support_email || 'lienhe@krmedi.com'}
              </a>
            </Text>
            <Text className={cx('privacy')}>
              Báo lỗi bảo mật:{' '}
              <a href={`mailto:${setting.technical_support_email || 'technical@krmedi.com'}`}>
                {setting.technical_support_email || 'technical@krmedi.com'}
              </a>
            </Text>
          </Col>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Về Krmedi
            </Title>
            {aboutUs.map((item) => (
              <Link key={item.id} to={routesConfig.footer_blog.replace(':slug', item.slug)}>
                {item.name}
              </Link>
            ))}
          </Col>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Hợp tác và liên kết
            </Title>
            {cooperationAsociation.map((item) => (
              <Link key={item.id} to={routesConfig.footer_blog.replace(':slug', item.slug)}>
                {item.name}
              </Link>
            ))}
            <Title level={3} className={cx('payment-title')}>
              Payment
            </Title>
            <Space className={cx('payment-icons')}>
              <img src={imagesFooter.visa} alt="Visa" />
              <img src={imagesFooter.tragop} alt="Tra Gop" />
              <img src={imagesFooter.circle} alt="Thanh Toan" />
              <img src={imagesFooter.JCB} alt="JCB" />
              <img src={imagesFooter.COD} alt="COD" />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Kết nối với chúng tôi
            </Title>
            <Space className={cx('social-media')}>
              <Link to={`mailto:${setting.email || 'lienhe@krmedi.com'}`}>
                <img src={imagesFooter.google} alt="Google" />
              </Link>
              <a href={setting.facebook || '#'} target="_blank" rel="noopener noreferrer">
                <img src={imagesFooter.facebook} alt="Facebook" />
              </a>
              <a href={setting.twitter || '#'} target="_blank" rel="noopener noreferrer">
                <img src={imagesFooter.twitter} alt="Twitter" />
              </a>
              <a href={`https://zalo.me/${setting.zalo || '#'}`} target="_blank" rel="noopener noreferrer">
                <img src={imagesFooter.zalo_icon} alt="Zalo" />
              </a>
            </Space>
          </Col>
        </Row>
        <Row justify="center" className={cx('copyright')}>
          <Col xs={24}>
            <Text>© 2023. All Rights Reserved.</Text>
            <br />
            <Text>Country & Region: Vietnam | China | Japan | Korea</Text>
          </Col>
        </Row>
      </AntFooter>
    </div>
  );
}

export default Footer;
