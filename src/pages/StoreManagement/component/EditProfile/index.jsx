import React, { memo, useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './EditProfile.module.scss';
import { imagesStore } from '~/assets/images';
import { fetchDistricts, fetchProvinces, fetchWards } from '~/api/province';
import { getProfileShop, updateShop } from '~/api/store';
import { useAuth } from '~/context/AuthContext';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import Warning from '~/components/Layout/Popup/Warning';

const cx = classNames.bind(styles);

function EditProfile() {
  const { user } = useAuth();
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateFailed, setShowUpdateFailed] = useState(false);
  const [showWarningField, setShowWarningField] = useState(false);

  // Avatar and Cover
  const [coverImage, setCoverImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(imagesStore.new_avatar);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [state, setState] = useState({
    loadingShop: true,
    dataShop: [],
  });
  const { loadingShop, dataShop } = state;

  useEffect(() => {
    const fetchDataProfileShop = async () => {
      try {
        const dataResponse = await getProfileShop();

        const {
          name,
          phone,
          email,
          scope,
          province_id,
          district_id,
          ward_id,
          address_detail,
          content,
          avatar,
          banner,
          src,
        } = dataResponse.data;

        setState((prevState) => ({
          ...prevState,
          loadingShop: false,
          dataShop: dataResponse.data || [],
        }));

        // Set form fields
        setShopName(name || '');
        setPhone(phone || '');
        setEmail(email || '');
        setScope(scope || '1');
        setSelectedProvince(province_id || '');
        setSelectedDistrict(district_id || '');
        setSelectedWard(ward_id || '');
        setAddressDetail(address_detail || '');
        setContent(content || '');

        // Set images if available
        setAvatarImage(avatar ? `${API_HOST}${avatar}` : imagesStore.new_avatar);
        setCoverImage(banner ? `${API_HOST}${banner}` : null);
        setSelectedImages((src || []).map((image) => `${API_HOST}${image}`));
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setState((prevState) => ({
          ...prevState,
          loadingShop: false,
        }));
      }
    };

    fetchDataProfileShop();
  }, []);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Choose Field
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // To hold the actual image files

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...imageUrls]);
    setSelectedFiles([...selectedFiles, ...files]); // Store the files for FormData
  };

  // Fetch Province API
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

  // Fetch District API
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
  const [selectedWard, setSelectedWard] = useState('');

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

  // Create Store API
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('1');
  const [addressDetail, setAddressDetail] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (
      !shopName ||
      !phone ||
      !email ||
      !scope ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !addressDetail ||
      !content
    ) {
      setShowWarningField(true);
      return;
    }
    const formData = new FormData();

    // Append form data
    formData.append('user_id', user.id);
    formData.append('name', shopName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('scope', scope);
    formData.append('province_id', selectedProvince);
    formData.append('district_id', selectedDistrict);
    formData.append('ward_id', selectedWard);
    formData.append('address_detail', addressDetail);
    formData.append('content', content);

    // Append avatar and cover images if available
    if (avatarFile) formData.append('avatar', avatarFile);
    if (coverFile) formData.append('banner', coverFile);

    // Append other selected images
    selectedFiles.forEach((file, index) => {
      formData.append(`src[${index}]`, file);
    });

    setLoadingFullScreen(true);
    try {
      const result = await updateShop(formData);
      if (!result.status) {
        setShowUpdateFailed(true);
        return;
      }
      setShowUpdateSuccess(true);
    } catch (error) {
      console.error('Error creating shop:', error);
      setShowUpdateFailed(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };
  if (loadingShop) {
    return <LoadingIndicator />;
  }
  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('create-profile')}>
        <div className={cx('cover')} style={{ backgroundImage: coverImage ? `url(${coverImage})` : 'none' }}>
          <div className={cx('new-cover')} onClick={() => coverInputRef.current.click()}>
            <img src={imagesStore.new_cover_icon} alt="New Image" className={cx('new_cover_icon')} />
            <span>Thay đổi ảnh bìa</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={coverInputRef}
              onChange={handleCoverImageChange}
            />
          </div>
          <div className={cx('new-avatar')}>
            <div className={cx('avater-wrapper')}>
              <img src={avatarImage} alt="New Avatar" className={cx('avartar-image')} />
              <img
                src={imagesStore.new_avatar_icon}
                alt="New Image"
                className={cx('new_avatar_icon')}
                onClick={() => avatarInputRef.current.click()}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={avatarInputRef}
                onChange={handleAvatarImageChange}
              />
            </div>
          </div>
        </div>
        <div className={cx('content')}>
          <div className={cx('basic-information', 'wrapper')}>
            <h5 className={cx('title')}>Thông tin cơ bản</h5>
            <div className={cx('box-wrapper', 'basic-information-details')}>
              <div className={cx('details')}>
                <label className={cx('names')}>Tên gian hàng</label>
                <input
                  type="text"
                  className={cx('input-field')}
                  placeholder="Tran Dinh Phi"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div className={cx('details')}>
                <label className={cx('names')}>SĐT gian hàng</label>
                <input
                  type="text"
                  className={cx('input-field')}
                  placeholder="0379357213"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={cx('details')}>
                <label className={cx('names')}>Email gian hàng</label>
                <input
                  type="text"
                  className={cx('input-field')}
                  placeholder="tphi6012@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={cx('details')}>
                <label className={cx('names')}>Phạm vi kinh doanh</label>
                <select
                  className={cx('select-field', 'input-field')}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option value="1">Toàn Quốc</option>
                  <option value="2">Tỉnh Thành</option>
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
                      <option value="" disabled>
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
                      <option value="" disabled>
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
                    <select
                      className={cx('address-select-field')}
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                    >
                      <option value="" disabled>
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
                      value={addressDetail}
                      onChange={(e) => setAddressDetail(e.target.value)}
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
              <textarea
                className={cx('content-field')}
                placeholder="Noi Dung"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
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
            <button className={cx('save-profile')} onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </div>
      </div>
      {showUpdateSuccess && (
        <Success message="Cập nhật cửa hàng thành công" onClose={() => setShowUpdateSuccess(false)} />
      )}
      {showUpdateFailed && <Failed message="Cập nhật cửa hàng thất bại" onClose={() => setShowUpdateFailed(false)} />}
      {showWarningField && (
        <Warning
          message="Vui lòng điền đủ thông tin"
          onClose={() => setShowWarningField(false)}
          onOk={() => setShowWarningField(false)}
        />
      )}
    </>
  );
}

export default memo(EditProfile);
