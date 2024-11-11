import React, { memo, useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import { fetchDistricts, fetchProvinces, fetchWards } from '~/api/province';
import { imagesStore } from '~/assets/images';
import { fetchProfile, postUpdateProfile } from '~/api/profile';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';
import Warning from '~/components/Layout/Popup/Warning';

const cx = classNames.bind(styles);

function Account() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarningField, setShowWarningField] = useState(false);
  //Avatar
  const [avatarImage, setAvatarImage] = useState(imagesStore.new_avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarInputRef = useRef(null);
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

  const [state, setState] = useState({
    loadingProfile: true,
    dataProfile: null,
  });

  const { loadingProfile, dataProfile } = state;

  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      try {
        const getProfileResponse = await fetchProfile();
        if (!getProfileResponse.status) {
          alert('Lấy thông tin profile thất bại, vui lòng thử lại');
          setState({ loadingProfile: false, dataProfile: null });
          return;
        }

        setState({
          loadingProfile: false,
          dataProfile: getProfileResponse.data,
        });

        const provincesData = await fetchProvinces();
        setProvinces(provincesData);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (getProfileResponse.data.province_id) {
          const districtsData = await fetchDistricts(getProfileResponse.data.province_id);
          setDistricts(districtsData);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (getProfileResponse.data.district_id) {
          const wardsData = await fetchWards(getProfileResponse.data.district_id);
          setWards(wardsData);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Lấy thông tin thất bại, vui lòng thử lại');
      }
    };

    fetchUserProfileAndData();
  }, []);

  useEffect(() => {
    if (dataProfile) {
      setUserName(dataProfile.name || '');
      setPhone(dataProfile.phone || '');
      setEmail(dataProfile.email || '');
      setAddressDetail(dataProfile.address_detail || '');
      setSelectedProvince(dataProfile.province_id || '');
      setSelectedDistrict(dataProfile.district_id || '');
      setSelectedWard(dataProfile.ward_id || '');
      if (dataProfile.avatar && !dataProfile.avatar.startsWith('data:')) {
        setAvatarImage(`${API_HOST}${dataProfile.avatar}`);
      } else {
        setAvatarImage(dataProfile.avatar || imagesStore.new_avatar);
      }
    }
  }, [dataProfile]);

  //Submit form
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  // Fetch Province API
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await fetchProvinces();
        setProvinces(data);
        await new Promise((resolve) => setTimeout(resolve, 500));
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
          await new Promise((resolve) => setTimeout(resolve, 500));
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
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Failed to load wards:', error);
        }
      };
      loadWards();
    }
  }, [selectedDistrict]);

  if (loadingProfile || !dataProfile) {
    return <LoadingIndicator />;
  }

  const handleSubmit = async () => {
    if (
      !userName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !addressDetail.trim()
    ) {
      setShowWarningField(true);
      return;
    }

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('province_id', selectedProvince);
    formData.append('district_id', selectedDistrict);
    formData.append('ward_id', selectedWard);
    formData.append('address_detail', addressDetail);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await postUpdateProfile(formData);
      if (!response.status) {
        alert('Cập nhật thông tin thất bại.');
        return;
      }

      localStorage.removeItem('user');
      const formDataObject = Object.fromEntries(formData.entries());
      localStorage.setItem('user', JSON.stringify(formDataObject));

      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to post profile:', error);
      alert('Cập nhật thông tin thất bại.');
    }
  };

  return (
    <>
      <h3 className={cx('title')}>Thông tin tài khoản</h3>
      <div className={cx('box-wrapper', 'basic-information-details')}>
        <div className={cx('details')}>
          <label className={cx('names')} style={{ textWrap: 'nowrap' }}>
            Hình ảnh đại diện
          </label>
          <div className={cx('d-flex', 'justify-content-center', 'w-100')}>
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
        <div className={cx('details')}>
          <label className={cx('names')}>Họ và tên</label>
          <input
            type="text"
            className={cx('input-field')}
            placeholder="Tran Dinh Phi"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className={cx('details')}>
          <label className={cx('names')}>Số điện thoại</label>
          <input
            type="text"
            className={cx('input-field')}
            placeholder="0379357213"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className={cx('details')}>
          <label className={cx('names')}>Email</label>
          <input
            type="text"
            className={cx('input-field')}
            placeholder="tphi6012@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={cx('details')}>
          <label className={cx('names')}>Địa chỉ</label>
          <div className={cx('address-fields')}>
            <div className={cx('w-100', 'double-input')}>
              <div className={cx('field-group')}>
                <select className={cx('address-select-field')} value={selectedProvince} onChange={handleProvinceChange}>
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
                <select className={cx('address-select-field')} value={selectedDistrict} onChange={handleDistrictChange}>
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
            </div>
            <div className={cx('field-group')}>
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
        <div className={cx('d-flex', 'justify-content-center')}>
          <button className={cx('save-profile')} onClick={handleSubmit}>
            Cập nhật
          </button>
        </div>
      </div>
      {/* Show Success Popup */}
      {showSuccess && <Success message="Cập nhật thành công" onClose={() => setShowSuccess(false)} />}
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

export default memo(Account);
