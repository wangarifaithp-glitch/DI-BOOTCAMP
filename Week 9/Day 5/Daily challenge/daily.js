import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import DailyTracker from "./DailyTracker.jsx";
import { store } from "./tracker.js";

createRoot(document.getElementById("root")).render(
  createElement(Provider, { store }, createElement(DailyTracker)),
);
