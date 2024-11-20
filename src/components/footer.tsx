import { ReactElement } from "react";

export default function Footer(): ReactElement<any> {
  return (
    <div className="flex flex-col max-w-[960px] w-full m-auto text-white text-[16px] space-y-[48px]">
      <div className="flex md:flex-row flex-col md:justify-between items-center">
        <img
          className="h-[48px]"
          src="/dream-con-logo-white.svg"
          alt="dream-con-logo-white"
        />
        <div>
          <a className="wv-ibmplex wv-bold underline" href="/">
            ร่วมถกเถียง
          </a>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">ติดต่อสอบถาม</span>
          <a className="underline" href="mailto: contact@wevis.info">
            contact@wevis.info
          </a>
        </div>
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">จัดทำโครงการโดย</span>
          <div className="flex md:flex-row flex-col space-x-[16px]">
            <img className="h-[32px]" src="/wevis-logo.svg" alt="wevis-logo" />
            <img className="h-[32px]" src="/fnf-logo.svg" alt="fnf-logo" />
            <img
              className="h-[32px]"
              src="/the-active-logo.svg"
              alt="the-active-logo"
            />
            <img
              className="h-[32px]"
              src="/101pub-logo.svg"
              alt="101pub-logo"
            />
            <img className="h-[32px]" src="/hand-logo.svg" alt="hand-logo" />
            <img className="h-[32px]" src="/tij-logo.svg" alt="tij-logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
