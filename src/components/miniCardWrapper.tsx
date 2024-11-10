import MiniCard from "./miniCard";

interface Props {
  rooms: Room[];
}
export default function MiniCardWrapper({ rooms }: Props) {
  return (
    <div className="flex flex-col space-y-[24px]">
      <h2 className="wv-ibmplex wv-bold text-[40px]">สำรวจข้อถกเถียง</h2>
      <div className="flex w-full items-end	">
        <input
          className="w-full h-[40px] p-[16px] text-[13px] border-[1px] border-solid border-[#D4D4D4] rounded-[48px] bg-[url('/search-icon.svg')] bg-no-repeat bg-[center_right_1rem]"
          type="text"
          placeholder="ค้นหาคำที่เกี่ยวข้อง"
        />
        <div className="w-full flex flex-col ml-[16px] text-[13px] max-w-[310px]">
          <span className="wv-bold">เรียงตามการมีส่วนร่วม</span>
          <div className="flex w-full h-[40px] mt-[4px]">
            <button className="w-full rounded-l-[48px] border-[1px] border-solid border-[#1C4CD3] text-[#1C4CD3]">
              ล่าสุด
            </button>
            <button className="w-full rounded-r-[48px] border-[1px] border-solid border-[#1C4CD3] text-[#1C4CD3]">
              มากที่สุด
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-fit m-auto">
        {rooms.map((room) => (
          <MiniCard key={room.id} room={room} />
        ))}
      </div>
      <a
        className="wv-ibmplex wv-bold text-[16px] leading-[20px] w-fit text-[#1C4CD3] underline m-auto"
        href="/"
      >
        สำรวจเพิ่ม...
      </a>
      <button className="flex m-auto w-fit py-[10px] px-[54px] items-center justify-center border-solid border-[2px] rounded-[48px] border-[#E8E8E8] bg-[#2579F5]">
        <img src="/plus-icon.svg" alt="icon-add-room" />
        <span className="wv-ibmplex wv-bold text-[16px] leading-[20px] ml-[8px] text-[#FFFFFF]">
          เพิ่มข้อถกเถียงใหม่
        </span>
      </button>
    </div>
  );
}
