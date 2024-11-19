import { useEffect, useState } from "react";
import { database, ref, onValue, set, push, get } from "../lib/firebase";
import MiniCardWrapper from "../components/miniCardWrapper";
import Hero from "../components/hero";
import Description from "../components/description";
import {
  AddRoomPayload,
  Room,
  Comment,
  CommentView,
  AddCommentPayload,
} from "../types/room";
import AddRoomModal from "../components/addRoomModal";
import AddCommentModal from "../components/addCommentModal";
import {
  HandleAddCommentToRoom,
  HandleDeleteRoom,
  HandleEditRoom,
} from "../util/room";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const getComment = async (id: string): Promise<Comment | null> => {
    const commentRef = ref(database, "comments/" + id);
    try {
      const snapshot = await get(commentRef);
      if (snapshot.exists()) {
        const data = snapshot.val();

        console.log(data);
        return convertComment(id, data);
      } else {
        console.log("No data available");
        return null;
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
    return null;
  };

  const convertComment = (id: string, data: any): Comment => {
    return {
      id: id,
      comment_view: ConvertCommentView(data.comment_view),
      reason: data.reason,
      like_count: data.like_count,
      parent_comment_ids: data.parent_comment_ids || [],
      parent_room_id: data.parent_room_id,
      comments: [], // no need to use
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const ConvertCommentView = (text: string): CommentView => {
    switch (text) {
      case "เห็นด้วย":
        return CommentView.AGREE;
      case "เห็นด้วยบางส่วน":
        return CommentView.PARTIAL_AGREE;
      case "ไม่เห็นด้วย":
        return CommentView.DISAGREE;
      default:
        return CommentView.AGREE;
    }
  };

  const convertRooms = async (data: any): Promise<Room[]> => {
    const rooms: Room[] = [];

    for (const key in data) {
      const room = data[key];
      const comments = await Promise.all(
        (room.comment_ids || []).map(async (commentId: string) => {
          const com = await getComment(commentId);
          console.log("com => ", com);
          return com;
        })
      );

      console.log("comments => ", await comments);
      rooms.push({
        id: key,
        title: room.title,
        comments: comments || [],
        child_node_ids: room.child_node_ids || [],
        created_at: room.created_at,
        updated_at: room.updated_at,
      });
    }

    return rooms;
  };

  useEffect(() => {
    const dataRef = ref(database, "rooms/");
    onValue(dataRef, async (snapshot) => {
      const dbValue = snapshot.val();

      console.log(dbValue);
      if (!dbValue) {
        return;
      }
      const convertedRooms = await convertRooms(dbValue);
      console.log("convertedRooms", convertedRooms);
      setRooms(convertedRooms);
    });
  }, []);

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
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
      <section id="hero" className="px-[24px] md:px-[160px] bg-[#BDE6FF]">
        <Hero />
      </section>
      <div className="bg-[#BDE6FF] h-[40px] flex items-end">
        <div
          style={{ backgroundImage: "url('/ellipse.svg')" }}
          className="bg-repeat w-full h-[16px]"
        />
      </div>

      <section
        id="description"
        className="px-[24px] md:px-[160px] py-[32px] md:py-[64px] bg-[#D2FED6]"
      >
        <Description />
      </section>
      <section
        id="mini-card"
        className="px-[24px] md:px-[160px]  py-[32px] md:py-[64px]"
      >
        <MiniCardWrapper
          rooms={rooms}
          onClickAddRoom={() => setIsAddRoomModalOpen(true)}
          onClickAddComment={onClickAddComment}
          onClickEditRoom={(roomId) => {
            setEditRoomId(roomId);
            setIsEditRoomModalOpen(true);
          }}
          onClickDeleteRoom={(room) => HandleDeleteRoom(room)}
        />
      </section>
      <div className="bg-[#FFFFFF] h-[40px] flex relative">
        <div
          style={{ backgroundImage: "url('/ellipse-2.svg')" }}
          className="bg-repeat w-full h-[16px] absolute top-[-2px]"
        />
      </div>
      {/* for add */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={addRoom}
      />
      {/* for edit */}
      <AddRoomModal
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
    </div>
  );
}
