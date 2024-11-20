import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { Helmet } from "react-helmet";
import { BASE_URL } from "./const/app";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const ogTitle = "DreamCon Argument";
const ogDescription = "พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน";
const ogImage = new URL("/og.png", BASE_URL).href;
const ogUrl = new URL("/", BASE_URL).href;

root.render(
  <React.StrictMode>
    <main
      className={`flex flex-col justify-between wv-ibmplexlooped text-[13px] min-h-screen bg-[#F8F8F8]`}
    >
      <Helmet>
        <title>{ogTitle}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogTitle} />
        <meta name="twitter:url" content={ogUrl} />
      </Helmet>
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
