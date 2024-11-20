import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Nav from "./components/nav";
import Footer from "./components/footer";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <main
      className={`flex flex-col justify-between wv-ibmplexlooped text-[13px] min-h-screen`}
    >
      <section>
        <section className="sticky top-0">
          <Nav />
        </section>
        <App />
      </section>
      <section className="bg-[#2579F5] py-[48px]">
        <Footer />
      </section>
    </main>
  </React.StrictMode>
);
