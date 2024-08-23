import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateProfile.module.scss';
import { imagesStore } from '~/assets/images';
import { fetchDistricts, fetchProvinces, fetchWards } from '~/api/province';

const cx = classNames.bind(styles);

function CreateProfile() {
  //Image Choose Field
  const [selectedImages, setSelectedImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...imageUrls]);
  };

  //Fetch Provice API
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      }
    };
    loadProvinces();
  }, []);

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSelectedDistrict('');
    setWards([]);
  };

  //Fetch District API
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        try {
          const data = await fetchDistricts(selectedProvince);
          setDistricts(data);
        } catch (error) {
          console.error('Failed to load districts:', error);
        }
      };
      loadDistricts();
    }
  }, [selectedProvince]);

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setWards([]);
  };

  // Fetch Ward API
  const [wards, setWards] = useState([]);
  useEffect(() => {
    if (selectedDistrict) {
      const loadWards = async () => {
        try {
          const data = await fetchWards(selectedDistrict);
          setWards(data);
        } catch (error) {
          console.error('Failed to load wards:', error);
        }
      };
      loadWards();
    }
  }, [selectedDistrict]);

  return (
    <div className={cx('create-profile')}>
      <div className={cx('cover')}>
        <div className={cx('new-cover')}>
          <img src={imagesStore.new_cover_icon} alt="New Image" className={cx('new_cover_icon')} />
          <span>Thêm ảnh bìa</span>
        </div>
        <div className={cx('new-avatar')}>
          <div className={cx('avater-wrapper')}>
            <img src={imagesStore.new_avatar} alt="New Avatar" />
            <img src={imagesStore.new_avatar_icon} alt="New Image" className={cx('new_avatar_icon')} />
          </div>
        </div>
      </div>

      <div className={cx('content')}>
        <div className={cx('basic-information', 'wrapper')}>
          <h5 className={cx('title')}>Thông tin cơ bản</h5>
          <div className={cx('box-wrapper', 'basic-information-details')}>
            <div className={cx('details')}>
              <label className={cx('names')}>Tên gian hàng</label>
              <input type="text" className={cx('input-field')} placeholder="Tran Dinh Phi" />
            </div>
            <div className={cx('details')}>
              <label className={cx('names')}>SĐT gian hàng</label>
              <input type="text" className={cx('input-field')} placeholder="0379357213" />
            </div>
            <div className={cx('details')}>
              <label className={cx('names')}>Email gian hàng</label>
              <input type="text" className={cx('input-field')} placeholder="tphi6012@gmail.com" />
            </div>
            <div className={cx('details')}>
              <label className={cx('names')}>Phạm vi kinh doanh</label>
              <select className={cx('select-field', 'input-field')}>
                <option value="toan-quoc" selected>
                  Toàn Quốc
                </option>
                <option value="tinh-thanh">Tỉnh Thành</option>
              </select>
            </div>
            <div className={cx('details')}>
              <label className={cx('names')}>Địa chỉ</label>
              <div className={cx('address-fields')}>
                <div className={cx('field-group')}>
                  <label className={cx('field-label')}>Tỉnh/Thành</label>
                  <select
                    className={cx('address-select-field')}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    <option value="" disabled selected>
                      Chọn Tỉnh/Thành
                    </option>
                    {provinces.map((province) => (
                      <option key={province.province_id} value={province.province_id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={cx('field-group')}>
                  <label className={cx('field-label')}>Quận/Huyện</label>
                  <select
                    className={cx('address-select-field')}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                  >
                    <option value="" disabled selected>
                      Chọn Quận/Huyện
                    </option>
                    {districts.map((district) => (
                      <option key={district.district_id} value={district.district_id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={cx('field-group')}>
                  <label className={cx('field-label')}>Phường/Xã</label>
                  <select className={cx('address-select-field')}>
                    <option value="" disabled selected>
                      Chọn Phường/Xã
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.wards_id} value={ward.wards_id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={cx('field-group')}>
                  <label className={cx('field-label')}>Số nhà, tên đường</label>
                  <input
                    type="text"
                    className={cx('address-select-field')}
                    placeholder="Input Text"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('introduce-post', 'wrapper')}>
          <h5 className={cx('title')}>Bài viết giới thiệu</h5>
          <div className={cx('box-wrapper', 'introduce-post-details')}>
            <label className={cx('names')}>Nội dung bài viết</label>
            <textarea className={cx('content-field')} placeholder="Noi Dung" rows={'5'}></textarea>
          </div>
        </div>

        <div className={cx('introduce-image', 'wrapper')}>
          <h5 className={cx('title')}>Hình ảnh giới thiệu</h5>
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
        </div>

        <div className={cx('d-flex', 'justify-content-end')}>
          <button className={cx('save-profile')}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default memo(CreateProfile);
