import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ModalAddress.module.scss';
import { Modal } from 'react-bootstrap';
import { fetchDistricts, fetchProvinces, fetchWards } from '~/api/province';
import { postCreateAddress } from '~/api/address';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function ModalAddAddress({ showModal, handleCloseModal }) {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [successAddAddress, setSuccessAddAddress] = useState(false);
  const [failedAddAddress, setFailedAddAddress] = useState(false);

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

  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputAddressDetail, setInputAddressDetail] = useState('');

  const handleSubmit = async () => {
    setLoadingFullScreen(true);

    const formData = new FormData();
    formData.append('name', inputName);
    formData.append('phone', inputPhone);
    formData.append('province_id', selectedProvince);
    formData.append('district_id', selectedDistrict);
    formData.append('ward_id', selectedWard);
    formData.append('address_detail', inputAddressDetail);

    try {
      const response = await postCreateAddress(formData);
      if (!response.status) {
        setFailedAddAddress(true);
        return;
      }

      setSuccessAddAddress(true);
      handleCloseModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to create address:', error);
      setFailedAddAddress(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };
  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal} className={cx('store-modal')}>
        <Modal.Header closeButton>
          <Modal.Title className={cx('modal-title')}>Địa chỉ giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={cx('w-100', 'double-input')}>
            <div>
              <label className={cx('modal-address-label-field')}>Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className={cx('modal-address-input-field')}
                required
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <div>
              <label className={cx('modal-address-label-field')}>Số điện thoại</label>
              <input
                type="text"
                placeholder="0987654321"
                className={cx('modal-address-input-field')}
                required
                onChange={(e) => setInputPhone(e.target.value)}
              />
            </div>
          </div>
          <div className={cx('w-100', 'double-input')}>
            <div>
              <label className={cx('modal-address-label-field')}>Tỉnh/ Thành phố</label>
              <select
                className={cx('modal-address-input-field')}
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
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
            <div>
              <label className={cx('modal-address-label-field')}>Quận/ Huyện</label>
              <select
                className={cx('modal-address-input-field')}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                required
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
          </div>
          <div className={cx('describe-wrapper', 'w-100')}>
            <label className={cx('modal-address-label-field')}>Phường/ Xã</label>
            <select
              className={cx('modal-address-input-field')}
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              required
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
          <div className={cx('describe-wrapper', 'w-100')}>
            <label className={cx('modal-address-label-field')}>Số nhà, tên đường</label>
            <input
              type="text"
              placeholder="Số 1, đường Hùng Vương"
              className={cx('modal-address-input-field')}
              required
              onChange={(e) => setInputAddressDetail(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" onClick={handleSubmit} className={cx('modal-submit-quote')}>
            Lưu
          </button>
        </Modal.Footer>
      </Modal>
      {successAddAddress && (
        <Success message="Địa chỉ được tạo thành công" onClose={() => setSuccessAddAddress(false)} />
      )}
      {failedAddAddress && <Failed message="Địa chỉ tạo thất bại" onClose={() => setFailedAddAddress(false)} />}
    </>
  );
}

export default memo(ModalAddAddress);