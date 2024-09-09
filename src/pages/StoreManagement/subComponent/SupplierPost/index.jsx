import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SupplierPost.module.scss';
import { imagesStore } from '~/assets/images';
import { fetchProvinces } from '~/api/province';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function SupplierPost() {
  const [state, setState] = React.useState({
    loading: true,
    dataListCity: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // To hold the actual image files
  const { loading, dataListCity } = state;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...imageUrls]);
    setSelectedFiles([...selectedFiles, ...files]); // Store the files for FormData
  };

  useEffect(() => {
    fetchDataListCityAPI();
  }, []);

  const fetchDataListCityAPI = async () => {
    try {
      const listCityResponse = await fetchProvinces();

      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListCity: listCityResponse || [],
      }));
    } catch (error) {
      console.error('Error fetching city data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  return (
    <>
      <div className={cx('supplier-notes')}>
        <div className={cx('content')}>
          <img src={imagesStore.productNote} alt="Note" />
          <div className={cx('note-text')}>
            <h3 className={cx('title')}>Để được KIỂM DUYỆT, nội dung tin cần có:</h3>
            <p>- Mô tả về sản phẩm cần tìm </p>
            <p>- Hình ảnh sản phẩml</p>
            <p>Lưu ý: mọi tin đăng bán sản phẩm sẽ không được duyệt</p>
          </div>
        </div>
      </div>
      <div className={cx('supplier-information', 'box-wrapper')}>
        <h3 className={cx('title', 'mb-0')}>Thông tin</h3>
        <div className={cx('w-100', 'double-input')}>
          <div>
            <label className={cx('label-field')}>Khu vực ưu tiên</label>
            <select className={cx('input-field')}>
              <option value="all">Toàn Quốc</option>
              {loading ? (
                <option>
                  <LoadingIndicator />
                </option>
              ) : (
                dataListCity.map((city, index) => (
                  <option key={index} value={city.id}>
                    {city.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className={cx('label-field')}>Hạn bài đăng</label>
            <input type="date" placeholder="01/01/2024" className={cx('input-field')} />
          </div>
        </div>
        <div className={cx('w-100', 'double-input')}>
          <div>
            <label className={cx('label-field')}>Thông tin liên hệ của bạn</label>
            <input type="text" placeholder="0379357213" className={cx('input-field')} />
          </div>
          <div>
            <label className={cx('label-field')}>Số lượng mua</label>
            <input type="number" placeholder="15" className={cx('input-field')} />
          </div>
        </div>
        <div className={cx('name-wrapper', 'w-100')}>
          <label className={cx('label-field')}>Tiêu đề bài đăng</label>
          <input type="text" placeholder="VD: tìm nhà cung cấp thuốc" className={cx('input-field')} />
        </div>
        <div className={cx('describe-wrapper', 'w-100')}>
          <label className={cx('label-field')}>Nội dung bài đăng</label>
          <textarea type="text" rows={3} placeholder="Viết nội dung bài đăng" className={cx('input-field')}></textarea>
        </div>
      </div>
      <div className={cx('image-information', 'box-wrapper')}>
        <h3 className={cx('title', 'mb-0')}>Hình ảnh</h3>
        <div className={cx('introduce-image-details')}>
          {selectedImages.map((image, index) => (
            <div key={index} className={cx('image-preview-wrapper')}>
              <img src={image} alt={`Preview ${index}`} className={cx('image-preview')} />
            </div>
          ))}
          <label className={cx('file-input-label')} htmlFor="file-input">
            <input type="file" id="file-input" className={cx('file-input')} multiple onChange={handleFileChange} />
            <span
              className={cx('file-icon')}
              style={{ backgroundImage: `url(${imagesStore.new_introduce_image})` }}
            ></span>
          </label>
        </div>
        <div className={cx('image-notes')}>
          <img src={imagesStore.productNote} alt="Note" />
          <p>Hình mô tả sản phẩm</p>
        </div>
      </div>

      <div className={cx('submit-btn')}>
        <button className={cx('post-supplier')}>Đăng bài</button>
      </div>
    </>
  );
}

export default memo(SupplierPost);
