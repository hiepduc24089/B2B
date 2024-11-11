import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch product details by slug
export const fetchProductDetails = async (slug, user_id) => {
  try {
    const response = await getData(apiURL.productDetails(slug), { params: { user_id } });
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// Fetch shop details by shop ID
export const fetchShopDetails = async (shop_id) => {
  try {
    const response = await getData(apiURL.shopDetails(shop_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching shop details:', error);
    throw error;
  }
};

//Post new Product
export const postProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postProduct, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post product:', error);
    throw error;
  }
};

//Update Product
export const postUpdateProduct = async (product_id, productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postUpdateProduct(product_id), productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post product:', error);
    throw error;
  }
};

//Update Remaining
export const postUpdateRemaining = async (product_id, productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postUpdateRemaining(product_id), productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post product:', error);
    throw error;
  }
};

//UPdate sale product
export const postUpdateSale = async (product_id, productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postUpdateSale(product_id), productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post sale product:', error);
    throw error;
  }
};

export const updateSaleDisplay = async (product_id, display) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(
      apiURL.updateSaleDisplay(product_id),
      { display },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Failed to update display:', error);
    throw error;
  }
};

export const deleteProductByShop = async (product_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.deleteProductByShop(product_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to delete Product:', error);
    throw error;
  }
};

//Show all product by shop at shop
export const fetchProductByShopAtShop = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getProductByShopAtShop, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch Product:', error);
    throw error;
  }
};

export const updateProductDisplay = async (product_id, display) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(
      apiURL.updateProductDisplayStatus(product_id),
      { display },
      {
        // Pass display in body
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Failed to update display:', error);
    throw error;
  }
};

export const getProductDetailAtShop = async (product_id) => {
  try {
    const token = localStorage.getItem('token');

    const response = await getData(apiURL.getProductDetailAtShop(product_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch Product:', error);
    throw error;
  }
};

export const postUpdateProductAtShop = async (request_id, productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(
      apiURL.postUpdateProductAtShop(request_id),
      { productData },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

//Ask to buy
export const postAskToBuyRequest = async (askToBuyData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postAskToBuy, askToBuyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to ask to buy:', error);
    throw error;
  }
};

//Follow Shop
export const postFollowShop = async (shop_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.postFollowShop,
      { shop_id },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error follow shop', error);
    throw error;
  }
};

//Check shop is follow or not
export const postCheckFollowShop = async (shop_id, user_id) => {
  try {
    const response = await postData(
      apiURL.checkFollowingShop,
      { shop_id, user_id },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error follow shop', error);
    throw error;
  }
};

//Delete product
export const postDeleteImage = async (product_id, src) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.deleteImage(product_id), src, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error delete image', error);
    throw error;
  }
};
