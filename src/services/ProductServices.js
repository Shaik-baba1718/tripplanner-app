import api from './api';

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get product error:', error);
    throw error;
  }
};

// Add to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', {
      productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

// Get cart items
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

// Remove from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};