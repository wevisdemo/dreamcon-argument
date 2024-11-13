"use client";

import { Comment, CommentView } from "@/types/room";

interface Props {
  comment: Comment;
  fullWidth?: boolean;
}
export default function MiniCard({ comment, fullWidth }: Props) {
  const getColor = (commentView: CommentView) => {
    switch (commentView) {
      case CommentView.AGREE:
        return "#6AB193";
      case CommentView.PARTIAL_AGREE:
        return "#D29C13";
      case CommentView.DISAGREE:
        return "#CB3535";
    }
  };

  const onclickLike = () => {
    console.log("like");
  };

  const onClickComment = () => {
    console.log("comment");
  };
  return (
    <div className="flex ">
      <div className={`w-[8px] bg-[${getColor(comment.comment_view)}]`} />
      <div
        className={`rounded-r-[8px] bg-[#FFFFFF] drop-shadow-md w-full ${
          fullWidth ? "max-w-full" : "max-w-[232px]"
        } flex flex-col gap-[8px] p-[16px]`}
      >
        <div className="flex items-center">
          <h5
            className={`wv-ibmplex wv-bold text-[16px] `}
            style={{ color: getColor(comment.comment_view) }}
          >
            {comment.comment_view}
          </h5>
          <span className="ml-[8px] text-[13px]">เพราะ...</span>
        </div>
        <p className="text-[13px]">{comment.reason}</p>
        <div className="flex justify-between">
          <div className="flex space-x-[8px] items-center">
            <div className="flex w-[16px] h-[16px] bg-[#6AB193] rounded-[8px] text-[13px] items-center justify-center text-[#ffffff] leading-0">
              <span>{comment.agree_count}</span>
            </div>
            <div className="flex w-[16px] h-[16px] bg-[#D29C13] rounded-[4px] text-[13px] items-center justify-center text-[#ffffff]">
              <span>{comment.partial_agree_count}</span>
            </div>
            <div className="flex w-[13px] h-[13px] bg-[#CB3535] text-[13px] items-center justify-center text-[#ffffff] rotate-45">
              <span className="rotate-[-45deg]">{comment.disagree_count}</span>
            </div>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <img
                className="w-[24px] h-[24px] hover:cursor-pointer"
                src="/heart-icon.svg"
                alt="heart-icon"
                onClick={onclickLike}
              />
              <span className="wv-bold ml-[4px]">{comment.like_count}</span>
            </div>
            <div className="flex items-center ml-[20px]">
              <img
                className="w-[24px] h-[24px] hover:cursor-pointer"
                src="/comment-icon.svg"
                alt="comment-icon"
                onClick={onClickComment}
              />
              <span className="wv-bold ml-[4px]">{comment.like_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
