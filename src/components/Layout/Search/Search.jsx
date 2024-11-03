import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { images } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { searchAll } from '~/api/filter';
import { API_HOST } from '~/config/host';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Control dropdown visibility
  const searchRef = useRef(null); // Reference to the search container
  const userID = localStorage.getItem('user_id') || 0;

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults();
      setIsDropdownVisible(true); // Show dropdown when there's a search term
    } else {
      setSearchResults([]); // Clear results when input is empty
      setIsDropdownVisible(false); // Hide dropdown when input is empty
    }
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await searchAll(searchTerm, 1);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef}>
      <HeadlessTippy
        visible={isDropdownVisible && searchResults.length > 0}
        interactive
        placement="bottom-start"
        render={(attrs) => (
          <div className={cx('search-results')} tabIndex="-1" {...attrs}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              searchResults.map((result, index) => (
                <div key={index}>
                  <Link
                    to={`${routesConfig.product_details.replace(':slug', result.slug).replace(':id', result.id)}`}
                    className={cx('product-link')}
                    onClick={() => setIsDropdownVisible(false)} // Close dropdown on click
                  >
                    <div className={cx('search-result-item')}>
                      <img src={`${API_HOST}${result.src[0]}`} alt={result.name} className={cx('search-src')} />
                      <span className={cx('search-result-name')}>{result.name}</span>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      >
        <div className={cx('search')}>
          <input
            className={cx('search-field', 'form-control')}
            placeholder="Nhập từ khoá để tìm kiếm"
            spellCheck={false}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownVisible(true)} // Show dropdown when input is focused
          />
          <button className={cx('search-btn', 'd-flex')}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <img src={images.camera} className={cx('camera-icon')} alt="Camera" />
        </div>
      </HeadlessTippy>
      <div className={cx('suggest')}>Thuốc chữa bệnh | Thực phẩm chức năng | Thuốc giảm đau</div>
    </div>
  );
}

export default Search;
