import { useEffect, useState } from "react";
import { database, ref, onValue, set, push, get } from "../lib/firebase";
import MiniCardWrapper from "../components/miniCardWrapper";
import Hero from "../components/hero";
import Description from "../components/description";
import { AddRoomPayload, Room, AddCommentPayload } from "../types/room";
import AddRoomModal from "../components/addRoomModal";
import AddCommentModal from "../components/addCommentModal";
import {
  HandleAddCommentToRoom,
  HandleDeleteRoom,
  HandleEditRoom,
} from "../util/room";
import { ConvertRoom } from "../util/converter";
import DeleteModal from "../components/deleteModal";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const convertRooms = async (data: any): Promise<Room[]> => {
    const rooms: Room[] = [];

    for (const key in data) {
      const room = await ConvertRoom(key, data[key]);
      rooms.push(room);
    }

    return rooms;
  };

  useEffect(() => {
    const dataRef = ref(database, "rooms/");
    onValue(dataRef, async (snapshot) => {
      const dbValue = snapshot.val();

      if (!dbValue) {
        return;
      }
      const convertedRooms = await convertRooms(dbValue);
      setRooms(convertedRooms);
    });
  }, []);

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomForDelete, setRoomForDelete] = useState<Room | null>(null);
  const [addCommentRoomId, setAddCommentRoomId] = useState<string>("");
  const [editRoomId, setEditRoomId] = useState<string>("");

  const addRoom = (payload: AddRoomPayload) => {
    const timeNow = new Date().toISOString();
    const dbPayload = {
      title: payload.title,
      comments: [],
      created_at: timeNow,
      updated_at: timeNow,
    };

    const newRoomRef = push(ref(database, "rooms/"), dbPayload);
  };

  const handleEditRoom = async (payload: AddRoomPayload) => {
    await HandleEditRoom(editRoomId, payload);
  };

  const getRoomById = (roomId: string) => {
    return rooms.find((room) => room.id === roomId);
  };

  const handleAddCommentToRoom = async (
    roomId: string,
    payload: AddCommentPayload
  ) => {
    await HandleAddCommentToRoom(roomId, payload);
  };

  const handleDeleteRoom = async (room: Room) => {
    await HandleDeleteRoom(room);
    setRoomForDelete(null);
  };

  const onClosedAddCommentModal = () => {
    setAddCommentRoomId("");
    setIsAddCommentModalOpen(false);
  };

  const onClickAddComment = (roomId: string) => {
    setAddCommentRoomId(roomId);
    setIsAddCommentModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      <section id="hero" className="px-[24px] bg-[#BDE6FF]">
        <div className="max-w-[960px] w-full m-auto">
          <Hero />
        </div>
      </section>
      <div className="bg-[#BDE6FF] h-[40px] flex items-end">
        <div
          style={{ backgroundImage: "url('/ellipse.svg')" }}
          className="bg-repeat w-full h-[16px]"
        />
      </div>

      <section
        id="description"
        className="px-[24px] py-[32px] md:py-[64px] bg-[#D2FED6]"
      >
        <div className="max-w-[960px] w-full m-auto">
          <Description />
        </div>
      </section>
      <section
        id="mini-card"
        className="px-[24px] py-[32px] md:py-[64px] bg-[#F8F8F8]"
      >
        <div className="max-w-[960px] w-full m-auto">
          <MiniCardWrapper
            rooms={rooms}
            onClickAddRoom={() => setIsAddRoomModalOpen(true)}
            onClickAddComment={onClickAddComment}
            onClickEditRoom={(roomId) => {
              setEditRoomId(roomId);
              setIsEditRoomModalOpen(true);
            }}
            onClickDeleteRoom={(room) => {
              setRoomForDelete(room);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      </section>
      {/* <div className="bg-[#FFFFFF] h-[40px] flex relative pb-[24px]">
        <div
          style={{ backgroundImage: "url('/ellipse-2.svg')" }}
          className="bg-repeat w-full h-[16px] absolute top-[-2px]"
        />
      </div> */}
      {/* <section className="py-[48px]">
        <div className="flex justify-between max-w-[960px] w-full m-auto space-x-[24px]">
          <div className="flex flex-col w-[50%]">
            <span className="text-[#1C4CD3] text-[16px] wv-bold">
              จะเกิดอะไรขึ้นต่อไป
            </span>
            <span className="text-[16px]">
              หากคุณอยากรู้ความคืบหน้าของโครงการว่าไปถึงไหน
              เราจะคอยส่งข่าวให้คุณรู้!
            </span>
          </div>
          <div className="flex w-[50%] items-start">
            <input
              className="w-full h-[40px] p-[16px] text-[13px] border-[1px] border-solid border-[#D4D4D4] rounded-[48px]"
              type="text"
              name="email-enter"
              id="email-enter"
              placeholder="ใส่อีเมลของคุณ"
            />
            <button className="flex mx-auto w-fit py-[10px] px-[54px] items-center justify-center border-solid border-[1px] rounded-[48px] border-[#E8E8E8] bg-[#2579F5] wv-ibmplex wv-bold text-[16px] leading-[20px] text-[#FFFFFF]">
              ติดตาม
            </button>
          </div>
        </div>
      </section> */}
      {/* for add */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={addRoom}
      />
      {/* for edit */}
      <AddRoomModal
        isEdit
        isOpen={isEditRoomModalOpen}
        onClose={() => {
          setIsEditRoomModalOpen(false);
          setEditRoomId("");
        }}
        onAddRoom={(payload) => {
          handleEditRoom(payload);
        }}
        defaultState={getRoomById(editRoomId)}
      />
      <AddCommentModal
        isOpen={isAddCommentModalOpen}
        onClose={onClosedAddCommentModal}
        submitComment={(payload) =>
          handleAddCommentToRoom(addCommentRoomId, payload)
        }
      />
      <DeleteModal
        title="ลบข้อถกเถียงนี้"
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={() => {
          if (roomForDelete) {
            handleDeleteRoom(roomForDelete);
          }
        }}
      />
    </div>
  );
}
