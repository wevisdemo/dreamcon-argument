"use client";
import { useEffect, useState } from "react";
import { database, ref, onValue, set, push, get } from "../lib/firebase";
import { mockRooms } from "../data/room";
import MiniCard from "@/components/miniCard";
import MiniCardWrapper from "@/components/miniCardWrapper";
import Hero from "@/components/hero";
import Description from "@/components/description";
import {
  AddRoomPayload,
  Room,
  Comment,
  CommentView,
  AddCommentPayload,
} from "@/types/room";
import AddRoomModal from "@/components/addRoomModal";
import { CommentDB } from "@/types/database";
import AddCommentModal from "@/components/addCommentModal";

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
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const [addCommentRoomId, setAddCommentRoomId] = useState<string>("");

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

  const onAddComment = (roomId: string, payload: AddCommentPayload) => {
    const timeNow = new Date().toISOString();
    const dbPayload = {
      comment_view: payload.comment_view,
      reason: payload.reason,
      parent_room_id: roomId,
      like_count: 0,
      created_at: timeNow,
      updated_at: timeNow,
    };

    const newCommentRef = push(ref(database, "comments/"), dbPayload);
    const newCommentId = newCommentRef.key;
    const roomRef = ref(database, "rooms/" + roomId);
    get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const commentIds = data.comment_ids || [];
        commentIds.push(newCommentId);
        set(ref(database, "rooms/" + roomId + "/comment_ids"), commentIds);
        set(ref(database, "rooms/" + roomId + "/updated_at"), timeNow);
      }
    });
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
        <div className="bg-[url('/ellipse.svg')] bg-repeat w-full h-[16px]" />
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
        />
      </section>
      <div className="bg-[#FFFFFF] h-[40px] flex relative">
        <div className="bg-[url('/ellipse-2.svg')] bg-repeat w-full h-[16px] absolute top-[-2px]" />
      </div>
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={addRoom}
      />
      <AddCommentModal
        isOpen={isAddCommentModalOpen}
        onClose={onClosedAddCommentModal}
        submitComment={(payload) => onAddComment(addCommentRoomId, payload)}
      />
    </div>
  );
}
