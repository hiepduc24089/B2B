import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../RelatedInformation.module.scss';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { API_HOST } from '~/config/host';
import Slider from 'react-slick';
import { imagesHome, imagesHotDeal } from '~/assets/images';
import { getProductByShop } from '~/api/store';
import FilterSearch from '~/components/Layout/FilterSearch';
import { Layout } from 'antd';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);
const { Header, Content } = Layout;

function RelatedInformation({ dataStore, shopID }) {
  const [activeTab, setActiveTab] = useState('introduction');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [state, setState] = React.useState({
    loading: true,
    dataProductStore: [],
  });
  const { loading, dataProductStore } = state;

  const imageUrls = dataStore.src ? JSON.parse(dataStore.src) : [];

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  //Get Product By Shop ID
  const [currentPage, setCurrentPage] = React.useState(1);

  const getNumberOfItems = () => {
    const width = window.innerWidth;

    if (width > 1200) return 12;
    if (width > 992) return 10;
    if (width > 768) return 8;
    if (width > 500) return 6;
    return 4;
  };
  const [numberOfItems, setNumberOfItems] = useState(getNumberOfItems());

  useEffect(() => {
    const handleResize = () => {
      setNumberOfItems(getNumberOfItems());
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchProductByShopID = async () => {
      try {
        const data = await getProductByShop(shopID, currentPage);

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataProductStore: data.data,
        }));
      } catch (error) {
        console.error('Failed to fetch store information:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchProductByShopID();
  }, [currentPage]);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={cx('related-information-wrapper')}>
      <div className={cx('related-information-header', 'd-flex', 'justify-content-between')}>
        <div className={cx('d-flex', 'w-100')}>
          <div
            className={cx('introduction-wrapper', { active: activeTab === 'introduction' })}
            onClick={() => setActiveTab('introduction')}
          >
            Giới thiệu
          </div>
          <div
            className={cx('product-wrapper', { active: activeTab === 'product' })}
            onClick={() => setActiveTab('product')}
          >
            Sản phẩm
          </div>
        </div>
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

      <div className={cx({ container: isMobile })}>
        <div className={cx('tab-content')}>
          {activeTab === 'introduction' && (
            <div className={cx('introduction-tab')}>
              <div dangerouslySetInnerHTML={{ __html: dataStore.content }} />

              <div className={cx('store-src')}>
                {imageUrls.length > 1 ? (
                  <Slider {...settings}>
                    {imageUrls.map((url, index) => (
                      <div key={index}>
                        <img src={`${API_HOST}${url}`} alt={`Slide ${index + 1}`} className={cx('src-img')} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  imageUrls.length === 1 && (
                    <img src={`${API_HOST}${imageUrls[0]}`} alt="Single Image" className={cx('src-img')} />
                  )
                )}
              </div>
              <div className={cx('product-outstanding')}>
                <div className={cx('title-header', 'd-flex', 'justify-content-between', 'align-items-center')}>
                  <h1>Sản phẩm nổi bật</h1>
                  <Link to={routesConfig.foryou} className={cx('see-all')}>
                    <p>
                      Xem tất cả
                      <img src={imagesHome.see_all} alt="See All Icon" />
                    </p>
                  </Link>
                </div>
                <div className={cx('product-detail-wrapper')}>
                  {dataProductStore.slice(0, numberOfItems).map((product, index) => (
                    <Link
                      key={index}
                      to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}
                    >
                      <div className={cx('product-items')}>
                        <img src={`${API_HOST}${product.src[0]}`} alt={product.name} />
                        <h1 className={cx('product-title')}>{product.name}</h1>
                        <h3 className={cx('product-price')}>
                          {formatPrice(product.original_price)}đ<span>/{product.unit}</span>
                        </h3>
                        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                          <span className={cx('negotiate')}>Có thể thương lượng</span>
                        </div>
                        <h5 className={cx('buy-at-least')}>
                          Mua sỉ từ{' '}
                          <span>
                            {product.min_quantity} {product.unit}
                          </span>
                        </h5>
                        <div className={cx('d-flex', 'justify-content-between')}>
                          <span className={cx('location')}>{product.province_name}</span>
                          <span className={cx('contact')}>2 lượt liên hệ</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'product' && (
            <div className={cx('product-tab')}>
              <Layout style={{ minHeight: '100vh', position: 'relative' }}>
                <FilterSearch />
                <Layout className={cx('layout-right')}>
                  <Header>
                    <div className={cx('d-flex', 'align-items-center', 'product-notes')}>
                      <img src={imagesHotDeal.check} alt="Check" />
                      <span>Chính hãng 100%</span>
                      <span>|</span>
                      <img src={imagesHotDeal.change} alt="Change" />
                      <span>Đổi trả hàng lỗi</span>
                    </div>
                  </Header>
                  <Content className={cx('product')}>
                    <div className={cx('product-tab-detail-wrapper')}>
                      {dataProductStore.map((product, index) => (
                        <Link
                          key={index}
                          to={`${routesConfig.product_details
                            .replace(':slug', product.slug)
                            .replace(':id', product.id)}`}
                        >
                          <div className={cx('product-items')}>
                            <img src={`${API_HOST}${product.src[0]}`} alt={product.name} />
                            <h1 className={cx('product-title')}>{product.name}</h1>
                            <h3 className={cx('product-price')}>
                              {formatPrice(product.original_price)}đ<span>/{product.unit}</span>
                            </h3>
                            <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                              <span className={cx('negotiate')}>Có thể thương lượng</span>
                            </div>
                            <h5 className={cx('buy-at-least')}>
                              Mua sỉ từ{' '}
                              <span>
                                {product.min_quantity} {product.unit}
                              </span>
                            </h5>
                            <div className={cx('d-flex', 'justify-content-between')}>
                              <span className={cx('location')}>{product.province_name}</span>
                              <span className={cx('contact')}>2 lượt liên hệ</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Content>
                </Layout>
              </Layout>
            </div>
          )}
        </div>
        ;
      </div>
    </div>
  );
}

export default memo(RelatedInformation);
