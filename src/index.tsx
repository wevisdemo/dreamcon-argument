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
      className={`flex flex-col justify-between wv-ibmplexlooped text-[13px] min-h-screen bg-[#F8F8F8]`}
    >
      <section>
        <section className="sticky top-0 z-[20]">
          <Nav />
        </section>
        <App />
      </section>
      <section className="bg-[#2579F5] py-[48px] px-[24px]">
        <Footer />
      </section>
    </main>
  </React.StrictMode>
);
