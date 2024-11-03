import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductAdd.module.scss';
import { images, imagesHotDeal, imagesStore } from '~/assets/images';
import { fetchAllListCategory } from '~/api/requestsupplier';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';
import { postProduct } from '~/api/product';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import { getProfileShop } from '~/api/store';
import Warning from '~/components/Layout/Popup/Warning';

const cx = classNames.bind(styles);

function ProductAdd({ onSubmitSuccess }) {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showAddFailed, setShowAddFailed] = useState(false);
  const [showWarningField, setShowWarningField] = useState(false);

  const [state, setState] = useState({
    loading: true,
    dataListCategory: [],
  });
  const { loading, dataListCategory } = state;
  const [showFullList, setShowFullList] = useState(false);

  const [inputName, setInputName] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputUnit, setInputUnit] = useState('');
  const [inputContactInfor, setInputContactInfor] = useState('');
  const [inputMinQuantity, setInputMinQuantity] = useState('');
  const [inputRemainingQuantity, setInputRemainingQuantity] = useState('');
  const [inputSKU, setInputSKU] = useState('');
  const [selectedCategoryID, setSelectedCategoryID] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // To hold the actual image files
  const [priceTiers, setPriceTiers] = useState([{ minQuantity: '', price: '' }]); // Array for price tiers

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...imageUrls]);
    setSelectedFiles([...selectedFiles, ...files]); // Store the files for FormData
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
    setSelectedImages(updatedImages);

    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
  };

  const handleAddPriceTier = () => {
    // Add a new empty price tier
    setPriceTiers([...priceTiers, { minQuantity: '', price: '' }]);
  };

  const handleRemoveLatestPriceTier = () => {
    // Remove the last price tier, only if more than one exists
    if (priceTiers.length > 1) {
      setPriceTiers(priceTiers.slice(0, -1));
    }
  };

  const handlePriceTierChange = (index, field, value) => {
    // Update specific price tier
    const newPriceTiers = [...priceTiers];
    newPriceTiers[index][field] = value;
    setPriceTiers(newPriceTiers);
  };

  const handleInputMinQuantityChange = (value) => {
    setInputMinQuantity(value);

    // Update the first minQuantity in priceTiers
    setPriceTiers((prevPriceTiers) => {
      const newPriceTiers = [...prevPriceTiers];
      if (newPriceTiers.length > 0) {
        newPriceTiers[0].minQuantity = value; // Set the first minQuantity
      }
      return newPriceTiers;
    });
  };

  const handleClearPriceTier = (indexToRemove) => {
    setPriceTiers((prevPriceTiers) => prevPriceTiers.filter((_, index) => index !== indexToRemove));
  };

  const fetchDataListCategoryAPI = async () => {
    try {
      const data = await fetchAllListCategory();
      setState({
        loading: false,
        dataListCategory: data.data,
      });
    } catch (error) {
      console.error('Error fetching category data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchDataListCategoryAPI();
  }, []);

  const [stateShop, setStateShop] = useState({
    dataShop: [],
  });
  const { dataShop } = stateShop;
  useEffect(() => {
    const fetchDataProfileShop = async () => {
      try {
        const dataResponse = await getProfileShop();
        setStateShop((prevState) => ({
          ...prevState,
          dataShop: dataResponse.data || [],
        }));
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setStateShop((prevState) => ({
          ...prevState,
        }));
      }
    };

    fetchDataProfileShop();
  }, []);

  const handleCategorySelect = (categoryName, categoryID) => {
    // Set the selected category and close the category list
    setSelectedCategory(categoryName);
    setSelectedCategoryID(categoryID);
    setShowFullList(false);
  };

  const handleSeeAll = () => {
    setShowFullList(true);
  };

  const handleCloseSeeAll = () => {
    setShowFullList(false);
  };

  const handleSubmit = async () => {
    const updatedPriceTiers = [...priceTiers];
    if (updatedPriceTiers.length > 0) {
      updatedPriceTiers[0].minQuantity = inputMinQuantity;
    }

    if (
      !inputName ||
      !inputDescription ||
      !selectedCategoryID ||
      !inputUnit ||
      !inputContactInfor ||
      !inputMinQuantity ||
      !inputRemainingQuantity ||
      !inputSKU ||
      updatedPriceTiers.some((tier) => !tier.minQuantity || !tier.price) || // Check if any price tier is incomplete
      selectedFiles.length === 0 // Check if at least one image is selected
    ) {
      setShowWarningField(true);
      return;
    }

    // Create FormData after updating priceTiers
    const formData = new FormData();
    formData.append('name', inputName);
    formData.append('describe', inputDescription);
    formData.append('category_id', selectedCategoryID);
    formData.append('unit', inputUnit);
    formData.append('contact_info', inputContactInfor);
    formData.append('minimum_quantity', inputMinQuantity);
    formData.append('quantity', inputRemainingQuantity);
    formData.append('sku', inputSKU);

    // Append updated price tiers
    const attributes = updatedPriceTiers.map((tier) => ({
      quantity: tier.minQuantity,
      price: tier.price,
    }));
    formData.append('attributes', JSON.stringify(attributes));

    // Append images
    selectedFiles.forEach((file, index) => {
      formData.append(`src[${index}]`, file);
    });

    setLoadingFullScreen(true);
    try {
      const response = await postProduct(formData);

      if (!response.status) {
        setShowAddFailed(true);
        return;
      }

      setShowAddSuccess(true);
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to post product:', error);
      setShowAddFailed(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const renderAllCategory = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('see-all-wrapper')}>
          <div className={cx('header')}>
            <h1>Nhóm thuốc</h1>
            <img src={imagesHotDeal.close_icon} alt="Close" className={cx('close')} onClick={handleCloseSeeAll} />
          </div>
          <div className={cx('cate-wrapper')}>
            {dataListCategory.map((category, index) => (
              <div
                key={index}
                className={cx('cate-item')}
                onClick={() => handleCategorySelect(category.name, category.id)}
              >
                <img src={`${API_HOST}${category.src}`} alt={category.name} />
                <h3>{category.name}</h3>
                <p>{category.product_count} sản phẩm</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('product-notes')}>
        <div className={cx('content')}>
          <img src={imagesStore.productNote} alt="Note" />
          <div className={cx('note-text')}>
            <h3 className={cx('title')}>Để đăng được sản phẩm, nội dung tin cần có:</h3>
            <p>Lưu ý, các trường hợp sau đây sẽ không được duyệt, hoặc bị khóa tài khoản:</p>
            <p>- Đăng bán giá lẻ </p>
            <p>- Chèn sdt, địa chỉ vào nội dung, hình ảnh sản phẩm</p>
          </div>
        </div>
      </div>
      <div className={cx('product-information', 'box-wrapper')}>
        <h3 className={cx('title', 'mb-0')}>Thông tin</h3>
        <div className={cx('name-wrapper', 'w-100')}>
          <label className={cx('label-field')}>Tên sản phẩm</label>
          <input
            type="text"
            placeholder="VD: tìm nhà cung cấp thuốc"
            className={cx('input-field')}
            onChange={(e) => setInputName(e.target.value)}
          />
        </div>
        <div className={cx('describe-wrapper', 'w-100')}>
          <label className={cx('label-field')}>Mô tả sản phẩm</label>
          <textarea
            type="text"
            rows={3}
            placeholder="Viết nội dung bài đăng"
            className={cx('input-field')}
            onChange={(e) => setInputDescription(e.target.value)}
          ></textarea>
        </div>
        <h3 className={cx('title', 'mb-0')}>Thông tin chi tiết</h3>
        <div className={cx('w-100', 'double-input')}>
          <div>
            <label className={cx('label-field')}>Nhóm thuốc</label>
            <input
              type="text"
              placeholder="nhấn để chọn nhóm thuốc"
              className={cx('input-field')}
              value={selectedCategory}
              onClick={handleSeeAll}
              readOnly
            />
          </div>
          <div>
            <label className={cx('label-field')}>Đơn vị</label>
            <select className={cx('input-field')} onChange={(e) => setInputUnit(e.target.value)}>
              <option>Nhấn để chọn</option>
              <option value="Hộp">Hộp</option>
              <option value="Tuýp">Tuýp</option>
              <option value="Ví">Ví</option>
              <option value="Cái">Cái</option>
              <option value="Lốc">Lốc</option>
              <option value="Lọ">Lọ</option>
              <option value="Cây">Cây</option>
            </select>
          </div>
        </div>
        <div className={cx('w-100', 'double-input')}>
          <div>
            <label className={cx('label-field')}>Thông tin liên hệ của bạn</label>
            <input
              type="text"
              placeholder="0379357213"
              className={cx('input-field')}
              onChange={(e) => setInputContactInfor(e.target.value)}
            />
          </div>
          <div>
            <label className={cx('label-field')}>Mua tối thiểu</label>
            <input
              type="number"
              placeholder="15"
              className={cx('input-field')}
              onChange={(e) => setInputMinQuantity(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={cx('image-information', 'box-wrapper')}>
        <h3 className={cx('title', 'mb-0')}>Hình ảnh</h3>
        <div className={cx('introduce-image-details')}>
          {selectedImages.map((image, index) => (
            <div key={index} className={cx('image-preview-wrapper')}>
              <img src={image} alt={`Preview ${index}`} className={cx('image-preview')} />
              <button className={cx('remove-image-button')} onClick={() => handleRemoveImage(index)}>
                X
              </button>
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
      <div className={cx('price-information', 'box-wrapper')}>
        <h3 className={cx('title', 'mb-0')}>Giá sản phẩm</h3>

        {priceTiers.map((tier, index) => (
          <div key={index} className={cx('w-100', 'price-tier')}>
            <div className={cx('price-tier-item')}>
              <label className={cx('label-field')}>Mua từ</label>
              <input
                type="number"
                placeholder="15"
                className={cx('input-field')}
                value={index === 0 ? inputMinQuantity : tier.minQuantity} // Use inputMinQuantity only for the first
                onChange={(e) =>
                  index === 0
                    ? handleInputMinQuantityChange(e.target.value)
                    : handlePriceTierChange(index, 'minQuantity', e.target.value)
                }
                readOnly={index === 0} // Make only the first minQuantity read-only
              />
            </div>
            <div className={cx('price-tier-item')}>
              <label className={cx('label-field')}>Giá bán</label>
              <input
                type="number"
                placeholder="150.000 VNĐ"
                className={cx('input-field')}
                value={tier.price}
                onChange={(e) => handlePriceTierChange(index, 'price', e.target.value)}
              />
            </div>
            {index > 0 && (
              <img
                src={images.minus_icon}
                alt="minus"
                className={cx('minus-icon')}
                onClick={() => handleClearPriceTier(index)}
              />
            )}
          </div>
        ))}

        {/* Add and Remove buttons */}
        <div className={cx('add-price-wrapper')}>
          <button className={cx('add-price-btn')} onClick={handleRemoveLatestPriceTier}>
            Bỏ bớt mốc giá
          </button>
          <button className={cx('add-price-btn')} onClick={handleAddPriceTier}>
            Thêm mốc giá
          </button>
        </div>
      </div>
      <div className={cx('remaining-information', 'box-wrapper')}>
        <div>
          <h3 className={cx('title', 'mb-0')}>Tồn kho</h3>
          <span className={cx('sub-title')}>
            Vui lòng cập nhật số lượng tồn kho thực tế của sản phẩm để tránh hủy, trễ đơn hàng gây ảnh hưởng đến Chỉ Số
            Bán Hàng
          </span>
        </div>
        <div className={cx('branch')}>
          <h4>Chinh nhánh</h4>
          <div className={cx('details')}>
            <div className={cx('infor')}>
              <span>{dataShop.name}</span>
              <p>{dataShop.full_address}</p>
            </div>
            <div>
              <label className={cx('label-field')}>Số lượng</label>
              <input
                type="number"
                placeholder="12"
                className={cx('input-field')}
                onChange={(e) => setInputRemainingQuantity(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={cx('w-100')}>
          <label className={cx('label-field')}>SKU (mã sản phẩm)</label>
          <input
            type="text"
            placeholder="VD: tìm nhà cung cấp thuốc"
            className={cx('input-field')}
            onChange={(e) => setInputSKU(e.target.value)}
          />
        </div>
      </div>
      <div className={cx('submit-btn')}>
        <button className={cx('post-product')} onClick={handleSubmit}>
          Đăng sản phẩm
        </button>
      </div>
      {showFullList && (
        <div className={cx('overlay')} onClick={handleCloseSeeAll}>
          <div className={cx('sidebar')} onClick={(e) => e.stopPropagation()}>
            {renderAllCategory()}
          </div>
        </div>
      )}
      {showAddSuccess && <Success message="Đăng sản phẩm mới thành công" onClose={() => setShowAddSuccess(false)} />}
      {showAddFailed && <Failed message="Đăng sản phẩm thất bại" onClose={() => setShowAddFailed(false)} />}
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

export default memo(ProductAdd);
