"use client";
import { useState } from "react";
import AddCommentModal from "@/components/addCommentModal";
import CommentCard from "@/components/commentCard";
import Hero from "@/components/hero";
import TitleCard from "@/components/rooms/titleCard";
import { mockRoom } from "@/data/room";
import { useParams } from "next/navigation";

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const room = mockRoom; // TODO: change this to real data
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onSubmitComment = () => {};

  return (
    <div className="flex flex-col">
      <section id="hero" className="px-[24px] md:px-[160px] bg-[#BDE6FF]">
        <Hero navigateLink="/" textNavigate="< ข้อถกเถียงทั้งหมด" />
      </section>
      <section
        id="info"
        className="px-[24px] md:px-[160px] py-[24px] md:py-[48px]"
      >
        <TitleCard
          room={room}
          onClickAddComment={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="flex flex-col gap-[16px]">
          {room.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
      <AddCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitComment={onSubmitComment}
      ></AddCommentModal>
    </div>
  );
}
