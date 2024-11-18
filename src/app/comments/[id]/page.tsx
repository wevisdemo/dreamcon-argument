"use client";

import CommentCard from "@/components/commentCard";
import Hero from "@/components/hero";
import TitleCard from "@/components/rooms/titleCard";
import { mockComment, mockPreviousComments, mockRoom } from "@/data/room";
import { CommentView } from "@/types/room";
import { useParams } from "next/navigation";

export default function CommentPage() {
  const { id } = useParams();
  const commentId = id as string;

  const room = mockRoom; // TODO: change this to real data
  const previouseComments = mockPreviousComments;
  const comment = mockComment;

  const getCommentsByView = (view: CommentView) => {
    return comment.comments.filter((c) => c.comment_view === view);
  };

  return (
    <div className="flex flex-col">
      <section
        id="header"
        className="px-[16px] md:px-[160px] py-[8px] md:py-[16px] bg-[#BDE6FF]"
      >
        <a
          href="/"
          className="wv-ibmplex wv-semibold text-[#1C4CD3] underline "
        >
          {"< ข้อถกเถียง"}
        </a>
      </section>
      <section className="md:px-[160px] p-0">
        <h4 className="wv-ibmplex wv-bold text-[16px] md:text-[25px] bg-[#FFFFFF] rounded-b-[8px] drop-shadow-md p-[16px] md:p-[24px]">
          {room.title}
        </h4>
        {previouseComments.map((comment) => (
          <div
            className="mt-[40px] w-full"
            key={`parent-comment-${comment.id}`}
          >
            <CommentCard
              comment={comment}
              fullWidth
              onClickLike={() => {}}
              onClickAddComment={() => {}}
            />
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-3 mt-[16px]">
          <div className=" w-full flex flex-col gap-[16px] items-center">
            {getCommentsByView(CommentView.AGREE).map((comment, index) => (
              <CommentCard
                onClickLike={() => {}}
                key={`agree-comment-${index}`}
                comment={comment}
                onClickAddComment={() => {}}
              />
            ))}
          </div>
          <div className="w-full flex flex-col gap-[16px] items-center">
            {getCommentsByView(CommentView.PARTIAL_AGREE).map(
              (comment, index) => (
                <CommentCard
                  onClickLike={() => {}}
                  key={`partial-agree-comment-${index}`}
                  comment={comment}
                  onClickAddComment={() => {}}
                />
              )
            )}
          </div>
          <div className="w-full flex flex-col gap-[16px] items-center">
            {getCommentsByView(CommentView.DISAGREE).map((comment, index) => (
              <CommentCard
                onClickLike={() => {}}
                key={`disagree-comment-${index}`}
                comment={comment}
                onClickAddComment={() => {}}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
