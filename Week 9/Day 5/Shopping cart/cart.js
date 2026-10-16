import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";

const initialProducts = [
  { id: 1, name: "Everyday Tote", description: "A sturdy canvas carry-all.", price: 24 },
  { id: 2, name: "Ceramic Mug", description: "A handmade mug for slow mornings.", price: 18 },
  { id: 3, name: "Pocket Notebook", description: "A little space for big ideas.", price: 12 },
  { id: 4, name: "Desk Plant", description: "A cheerful green addition to your desk.", price: 16 },
];

const productsSlice = createSlice({
  name: "products",
  initialState: initialProducts,
  reducers: {},
});

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      const existingItem = state.find(
        (item) => item.productId === action.payload,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ productId: action.payload, quantity: 1 });
      }
    },
  },
});

export const { addToCart } = cartSlice.actions;

export const rootReducer = {
  products: productsSlice.reducer,
  cart: cartSlice.reducer,
};

export const store = configureStore({ reducer: rootReducer });

export const selectProducts = (state) => state.products;
export const selectCart = (state) => state.cart;

export const selectCartItems = createSelector(
  [selectProducts, selectCart],
  (products, cartItems) =>
    cartItems.map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.productId);

      if (!product) {
        throw new Error(`Cart contains unknown product ID: ${cartItem.productId}`);
      }

      return { ...product, quantity: cartItem.quantity };
    }),
);

export const calculateTotalPrice = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
);
