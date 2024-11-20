import { ReactElement } from "react";

export default function Footer(): ReactElement<any> {
  return (
    <div className="flex flex-col max-w-[960px] w-full m-auto text-white text-[16px] space-y-[48px] text-left">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center space-y-[32px]">
        <img
          className="h-[48px] w-fit"
          src="/dream-con-logo-white.svg"
          alt="dream-con-logo-white"
        />
        <div>
          <a className="wv-ibmplex wv-bold underline" href="/">
            ร่วมถกเถียง
          </a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between space-y-[32px]">
        <div className="flex flex-col md:justify-between space-y-[8px]">
          <span className="wv-ibmplex wv-bold">ติดต่อสอบถาม</span>
          <a className="underline" href="mailto: contact@wevis.info">
            contact@wevis.info
          </a>
        </div>
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">จัดทำโครงการโดย</span>
          <div className="flex space-x-[16px] justify-between">
            <div className="flex md:flex-row flex-col space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
              <a target="_blank" href="https://wevis.info/">
                <img
                  className="h-[32px]"
                  src="/wevis-logo.svg"
                  alt="wevis-logo"
                />
              </a>
              <a target="_blank" href="https://www.freiheit.org/thailand">
                <img className="h-[32px]" src="/fnf-logo.svg" alt="fnf-logo" />
              </a>

              <a target="_blank" href="https://theactive.net/">
                <img
                  className="h-[32px]"
                  src="/the-active-logo.svg"
                  alt="the-active-logo"
                />
              </a>
            </div>
            <div className="flex md:flex-row flex-col space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
              <a target="_blank" href="https://101pub.org/">
                <img
                  className="h-[32px]"
                  src="/101pub-logo.svg"
                  alt="101pub-logo"
                />
              </a>

              <a target="_blank" href="https://hand.co.th/">
                <img
                  className="h-[32px]"
                  src="/hand-logo.svg"
                  alt="hand-logo"
                />
              </a>

              <a target="_blank" href="https://www.tijthailand.org/">
                <img className="h-[32px]" src="/tij-logo.svg" alt="tij-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
