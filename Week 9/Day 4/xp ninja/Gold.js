import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/features/auth/authSlice.js';
import productsReducer from './src/features/products/productSlice.js';
import cartReducer from './src/features/cart/cartSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;