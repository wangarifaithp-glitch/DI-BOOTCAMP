import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import BookList from "./BookList.jsx";
import { store } from "./books.js";

createRoot(document.getElementById("root")).render(
  createElement(Provider, { store }, createElement(BookList)),
);