export const apiURL = {
  // User Authentication
  sendCode: '/api/send-code',
  verifyCode: '/api/verify-code',
  register: '/api/register',
  login: '/api/login',

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

  //Render Category Product
  getCategoyProduct: '/api/filter-Product',
};
