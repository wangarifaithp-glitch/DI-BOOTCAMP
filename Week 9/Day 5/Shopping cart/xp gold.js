import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import ShoppingCart from "./ShoppingCart.jsx";
import { store } from "./cart.js";

createRoot(document.getElementById("root")).render(
  createElement(Provider, { store }, createElement(ShoppingCart)),
);