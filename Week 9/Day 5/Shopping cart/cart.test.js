import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";

import {
  addToCart,
  calculateTotalPrice,
  rootReducer,
  selectCartItems,
  selectProducts,
} from "./cart.js";

test("the store starts with products and an empty cart", () => {
  const store = configureStore({ reducer: rootReducer });
  const state = store.getState();

  assert.equal(selectProducts(state).length, 4);
  assert.deepEqual(selectCartItems(state), []);
  assert.equal(calculateTotalPrice(state), 0);
});

test("adding products updates cart quantities and the total", () => {
  const store = configureStore({ reducer: rootReducer });
  const [tote, mug] = selectProducts(store.getState());

  store.dispatch(addToCart(tote.id));
  store.dispatch(addToCart(tote.id));
  store.dispatch(addToCart(mug.id));

  const cartItems = selectCartItems(store.getState());

  assert.deepEqual(
    cartItems.map(({ name, quantity }) => ({ name, quantity })),
    [
      { name: "Everyday Tote", quantity: 2 },
      { name: "Ceramic Mug", quantity: 1 },
    ],
  );
  assert.equal(calculateTotalPrice(store.getState()), 66);
});
