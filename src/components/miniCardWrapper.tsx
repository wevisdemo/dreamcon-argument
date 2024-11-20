import MiniCard from "./miniCard";
import { Room } from "../types/room";
import { useState } from "react";
import { RoomSortOption } from "../types/app";

interface Props {
  rooms: Room[];
  onClickAddRoom: () => void;
  onClickAddComment: (roomId: string) => void;
  onClickEditRoom: (roomId: string) => void;
  onClickDeleteRoom: (room: Room) => void;
}
export default function MiniCardWrapper({
  rooms,
  onClickAddRoom,
  onClickAddComment,
  onClickEditRoom,
  onClickDeleteRoom,
}: Props) {
  const [filter, setFilter] = useState<RoomSortOption>(RoomSortOption.LATEST);
  const [search, setSearch] = useState<string>("");

  const displayRooms = () => {
    let filteredRooms = rooms;
    if (search) {
      filteredRooms = rooms.filter((room) =>
        room.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filteredRooms.sort((a, b) => {
      if (filter === RoomSortOption.LATEST) {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      } else {
        return b.child_node_ids.length - a.child_node_ids.length;
      }
    });
  };

  return (
    <div className="flex flex-col space-y-[24px]">
      <h2 className="wv-ibmplex wv-bold text-[40px]">สำรวจข้อถกเถียง</h2>
      <div className="flex md:flex-row flex-col w-full md:items-end md:space-x-[16px] space-y-[16px]">
        <div className="w-full relative">
          <input
            value={search}
            style={{ backgroundImage: "url('/search-icon.svg')" }}
            className="w-full h-[40px] p-[16px] text-[13px] border-[1px] border-solid border-[#D4D4D4] rounded-[48px] bg-no-repeat bg-[center_right_1rem]"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาคำที่เกี่ยวข้อง"
          />
          <img
            src="/close-icon.svg"
            alt="close-icon"
            className="wv-ibmplex wv-bold absolute top-[8px] right-[40px] p-[4px] hover:cursor-pointer"
            style={{ display: search.length > 0 ? "block" : "none" }}
            onClick={() => setSearch("")}
          />
        </div>
        <div className="w-full flex flex-col text-[13px] max-w-[310px]">
          <span className="wv-bold">เรียงตามการมีส่วนร่วม</span>
          <div className="flex w-full h-[40px] mt-[4px]">
            <button
              style={{
                backgroundColor:
                  filter === RoomSortOption.LATEST ? "#1C4CD3" : "#FFFFFF",
                color: filter === RoomSortOption.LATEST ? "#FFFFFF" : "#1C4CD3",
              }}
              className="w-full rounded-l-[48px] border-[1px] border-solid border-[#1C4CD3] "
              onClick={() => setFilter(RoomSortOption.LATEST)}
            >
              ล่าสุด
            </button>
            <button
              style={{
                backgroundColor:
                  filter === RoomSortOption.POPULAR ? "#1C4CD3" : "#FFFFFF",
                color:
                  filter === RoomSortOption.POPULAR ? "#FFFFFF" : "#1C4CD3",
              }}
              className="w-full rounded-r-[48px] border-[1px] border-solid border-[#1C4CD3] "
              onClick={() => setFilter(RoomSortOption.POPULAR)}
            >
              มากที่สุด
            </button>
          </div>
        </div>
      </div>
      {displayRooms().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-fit m-auto">
          {displayRooms().map((room) => (
            <MiniCard
              key={room.id}
              room={room}
              onClickAddComment={onClickAddComment}
              onClickEdit={() => onClickEditRoom(room.id)}
              onClickDelete={() => onClickDeleteRoom(room)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[200px]">
          <span className="wv-ibmplex wv-bold text-[16px] leading-[20px] mt-[16px]">
            ไม่มีข้อมูล
          </span>
        </div>
      )}

      {/* <a
        className="wv-ibmplex wv-bold text-[#1C4CD3] underline text-[16px] leading-[20px] w-fit m-auto"
        href="/"
      >
        สำรวจเพิ่ม...
      </a> */}
      <button
        onClick={onClickAddRoom}
        className="flex m-auto w-fit py-[10px] px-[54px] items-center justify-center border-solid border-[2px] rounded-[48px] border-[#E8E8E8] bg-[#2579F5]"
      >
        <img src="/plus-icon.svg" alt="icon-add-room" />
        <span className="wv-ibmplex wv-bold text-[16px] leading-[20px] ml-[8px] text-[#FFFFFF]">
          เพิ่มข้อถกเถียงใหม่
        </span>
      </button>
    </div>
  );
}
