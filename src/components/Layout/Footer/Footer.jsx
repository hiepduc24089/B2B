import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Space } from 'antd';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { imagesFooter } from '~/assets/images';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;
const cx = classNames.bind(styles);

function Footer() {
  return (
    <div className={cx('container')}>
      <AntFooter className={cx('footer')}>
        <Row gutter={[16, 16]} className={cx('footer-wrapper')}>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Hỗ trợ khách hàng
            </Title>
            <Text className={cx('hotline')}>Hotline: 1900-6074 (1.000đ/phút, 8h-17h30 trừ T7, CN)</Text>
            <Link to="#">Các câu hỏi thường gặp</Link>
            <Link to="#">Gửi yêu cầu hỗ trợ</Link>
            <Link to="#">Hướng dẫn đặt hàng</Link>
            <Link to="#">Hướng dẫn hủy đơn hàng</Link>
            <Link to="#">Phương thức vận chuyển</Link>
            <Link to="#">Chính sách đổi trả</Link>
            <Text className={cx('support')}>
              Hỗ trợ khách hàng: <a href="mailto:lienhe@krmedi.com">lienhe@krmedi.com</a>
            </Text>
            <Text className={cx('privacy')}>
              Báo lỗi bảo mật: <a href="mailto:technical@krmedi.com">technical@krmedi.com</a>
            </Text>
          </Col>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Về Krmedi
            </Title>
            <Link to="#">Giới thiệu</Link>
            <Link to="#">Blog Kinh Doanh</Link>
            <Link to="#">Tuyển dụng</Link>
            <Link to="#">Điều khoản sử dụng</Link>
            <Link to="#">Tiếp thị thanh toán</Link>
            <Link to="#">Chế tài nhà cung cấp</Link>
            <Link to="#">Chính sách bảo mật thanh toán</Link>
            <Link to="#">Chính sách bảo mật thông tin cá nhân</Link>
            <Link to="#">Chính sách giải quyết khiếu nại</Link>
            <Link to="#">Chính sách giao nhận hàng hóa</Link>
          </Col>
          <Col xs={24} sm={12} md={6} className={cx('footer-column')}>
            <Title className={cx('title')} level={3}>
              Hợp tác và liên kết
            </Title>
            <Link to="#">Quy chế hoạt động sàn TMDT</Link>
            <Link to="#">Bán hàng cùng krmedi</Link>
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
              <Link to="#">
                <img src={imagesFooter.google} alt="Google" />
              </Link>
              <Link to="#">
                <img src={imagesFooter.facebook} alt="Facebook" />
              </Link>
              <Link to="#">
                <img src={imagesFooter.twitter} alt="Twitter" />
              </Link>
              <Link to="#">
                <img src={imagesFooter.apple} alt="Apple" />
              </Link>
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
