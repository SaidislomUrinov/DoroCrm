import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./contexts/store";
import { Toaster } from "sonner";
document.addEventListener(
  "wheel",
  function (e) {
    const el = document.activeElement;
    if (el && el.type === "number" && el.matches(":focus")) {
      e.preventDefault(); // Scrollni to‘xtatadi
    }
  },
  { passive: false }
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster richColors position="top-center" />
    </Provider>
  </BrowserRouter>
);
