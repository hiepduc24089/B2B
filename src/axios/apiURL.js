export const apiURL = {
  // User Authentication
  sendCode: '/api/send-code',
  verifyCode: '/api/verify-code',
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',

  //Get user
  getProfile: '/api/get-profile',
  updateProfile: '/api/update-profile',
  fetchMyOrder: '/api/user-order',
  fetchFavoriteProduct: '/api/get-favorite-product',
  getFollowingShop: '/api/get-follow-shop',
  unfollowShop: '/api/unfollow-shop',
  fetchViewedProduct: '/api/get-viewed-products',
  fetchQuoteSent: '/api/get-quotes-user',

  //Address
  createAddress: 'api/create-delivery-address',
  getAddress: 'api/get-delivery-address',
  updateDefaultAddress: (address_id) => `api/select-default-address/${address_id}`,
  getDetailAddress: (address_id) => `api/detail-delivery-address/${address_id}`,
  updateUserAddress: (address_id) => `api/update-delivery-address/${address_id}`,
  deleteUserAddress: (address_id) => `api/delete-delivery-address/${address_id}`,

  // Location
  provinces: '/api/province',
  districts: (province_id) => `/api/district/${province_id}`,
  wards: (district_id) => `/api/wards/${district_id}`,

  //Home
  dealHotToday: '/api/deal-hot-today',
  productForYou: '/api/product-for-you',
  trademark: '/api/trademark',
  getRequestSupplier: '/api/get-request-supplier',
  category: '/api/category',
  postFavoriteProduct: '/api/favorite-product',

  // Product and Shop Details
  productDetails: (slug) => `/api/detail-product/${slug}`,
  shopDetails: (shop_id) => `/api/detail-shop/${shop_id}`,
  postProduct: '/api/create-product',
  postUpdateProduct: (product_id) => `/api/update-product/${product_id}`,
  getProductByShopAtShop: '/api/get-product',
  deleteProductByShop: (product_id) => `/api/delete-product/${product_id}`,
  updateProductDisplayStatus: (product_id) => `/api/update-product-display/${product_id}`,
  getProductDetailAtShop: (product_id) => `/api/detail-product-shop/${product_id}`,
  postAskToBuy: '/api/save-ask-buy',
  postFollowShop: '/api/follow-shop',
  checkFollowingShop: '/api/check-follow-shop',

  //Payment
  addToCart: '/api/add-to-cart',
  getCart: '/api/get-cart',
  updateCartQuantity: '/api/update-cart-quantity',
  removeProductFromCart: '/api/remove-product-from-cart',
  removeShopFromCart: '/api/remove-shop-from-cart',
  checkout: '/api/checkout',
  pay: '/api/pay',
  buyNow: '/api/buy-now',

  // Store Management
  createShop: '/api/create-shop',
  getShopByUser: (shop_id) => `/api/detail-shop/${shop_id}`,
  getProductByShop: (shop_id, user_id, page) => `/api/get-product-shop/${shop_id}?user_id=${user_id}&page=${page}`,

  //Render Category Product
  getCategoyProduct: '/api/filter-Product',

  //Order
  getListOrder: '/api/shop-order',
  getOrderDetail: (order_id) => `/api/detail-user-order/${order_id}`,

  //Request Supplier
  getListRequestSuppier: '/api/get-request-supplier-user',
  getListPriceQuote: '/api/get-quotes',
  getPriceQuoteDetail: (quote_id) => `/api/detail-quotes/${quote_id}`,
  getAllListCategory: '/api/category-product',
  postRequestSupplier: '/api/create-request-supplier',
  getDetailRequest: (request_id) => `/api/edit-request-supplier-user/${request_id}`,
  postCreateQuote: '/api/create-quotes',
  postUpdateRequestStatus: (request_id) => `/api/update-request-display/${request_id}`,
};
