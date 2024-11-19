import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <html lang="en">
      <body className={`wv-ibmplexlooped text-[13px]`}>
        <App />
      </body>
    </html>
  </React.StrictMode>
);
