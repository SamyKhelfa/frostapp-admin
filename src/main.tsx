import "react-toastify/dist/ReactToastify.css";

import "@core/i18n/i18n";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./core/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "@core/redux";
import { ToastContainer } from "react-toastify";
import { I18nAntdProvider } from "@ui/components/I18nAntdProvider";

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nAntdProvider>
        <Provider store={store}>
          <AuthProvider>
            <App />
            <ToastContainer />
          </AuthProvider>
        </Provider>
      </I18nAntdProvider>
    </BrowserRouter>
  </React.StrictMode>
);
