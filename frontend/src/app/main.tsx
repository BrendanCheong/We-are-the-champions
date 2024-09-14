import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppProvider from "./provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
