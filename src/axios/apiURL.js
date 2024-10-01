export const apiURL = {
  // User Authentication
  sendCode: '/api/send-code',
  verifyCode: '/api/verify-code',
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',

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

  // Product and Shop Details
  productDetails: (slug) => `/api/detail-product/${slug}`,
  shopDetails: (shop_id) => `/api/detail-shop/${shop_id}`,
  postProduct: '/api/create-product',
  getProductByShopAtShop: '/api/get-product',
  updateProductDisplayStatus: (product_id) => `/api/update-product-display/${product_id}`,
  postAskToBuy: '/api/save-ask-buy',

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
  getProductByShop: (shop_id, page) => `/api/get-product-shop/${shop_id}?page=${page}`,

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
};
