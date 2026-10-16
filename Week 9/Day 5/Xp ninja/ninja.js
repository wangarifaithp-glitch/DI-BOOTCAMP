import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import TodoList from "./TodoList.jsx";
import { store } from "./todos.js";

createRoot(document.getElementById("root")).render(
  createElement(Provider, { store }, createElement(TodoList)),
);