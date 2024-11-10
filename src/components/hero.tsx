export default function Hero() {
  return (
    <div className="flex flex-col gap-0 md:gap-[16px]">
      <div className="flex justify-between">
        <img src="/cloud-1.svg" alt="cloud-1" />
        <img src="/cloud-2.svg" alt="cloud-2" />
        <img src="/cloud-3.svg" alt="cloud-3" className="md:block hidden" />
      </div>
      <h2 className="wv-ibmplex wv-bold text-[40px]">ข้อถกเถียงต่อยอด</h2>
      <div className="flex justify-between">
        <img src="/cloud-4.svg" alt="cloud-4" />
        <img src="/cloud-5.svg" alt="cloud-5" />
        <img src="/cloud-6.svg" alt="cloud-6" className="md:block hidden" />
      </div>
    </div>
  );
}
