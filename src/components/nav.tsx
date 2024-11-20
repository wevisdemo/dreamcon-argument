import { ReactElement } from "react";

// todo: if has some tabs later, we have to handle state
export default function Nav(): ReactElement<any> {
  return (
    <div className="flex justify-between items-center bg-white px-[16px]">
      <a href="/">
        <img src="/dream-con-logo-blue.svg" alt="dream-con-logo" />
      </a>
      <div>
        <button className="text-[16px] bg-[#BDE6FF] py-[22px] px-[16px] wv-ibmplex wv-bold">
          ร่วมถกเถียง
        </button>
      </div>
    </div>
  );
}
