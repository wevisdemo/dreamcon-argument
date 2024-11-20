import { Comment, CommentView } from "../types/room";
import { useEffect, useState } from "react";

interface Props {
  comment: Comment;
  fullWidth?: boolean;
  onClickLike: () => void;
  onClickAddComment: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
}
export default function CommentCard({
  comment,
  fullWidth,
  onClickLike,
  onClickAddComment,
  onClickEdit,
  onClickDelete,
}: Props) {
  const getCommentCountByView = (view: CommentView) => {
    return (comment.comments || []).filter((c) => c.comment_view === view)
      .length;
  };
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

  useEffect(() => {}, [comment]);

  const handleClickComment = () => {
    onClickAddComment();
  };

  const [isLike, setIsLike] = useState<boolean>(false);

  const handleClickLike = () => {
    setIsLike(true);
    onClickLike();
  };

  return (
    <a href={`/comments/${comment.id}`} className=" w-full">
      <div className="flex justify-center w-full">
        <div className={`w-[8px] bg-[${getColor(comment.comment_view)}]`} />
        <div
          className={`rounded-r-[8px] bg-[#FFFFFF] drop-shadow-md w-full ${
            fullWidth ? "max-w-full" : "max-w-[232px]"
          } flex flex-col gap-[8px] p-[16px]`}
        >
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <h5
                className={`wv-ibmplex wv-bold text-[16px] `}
                style={{ color: getColor(comment.comment_view) }}
              >
                {comment.comment_view}
              </h5>
              <span className="ml-[8px] text-[13px]">เพราะ...</span>
            </span>
            <div className="flex justify-end space-x-[8px]">
              <img
                src="/pen-icon.svg"
                alt="pen-icon"
                className="w-[24px] hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClickEdit();
                }}
              />
              <img
                src="/bin-icon.svg"
                alt="bin-icon"
                className="w-[24px] hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClickDelete();
                }}
              />
            </div>
          </div>

          <p className="text-[13px]">{comment.reason}</p>
          <div className="flex justify-between">
            <div className="flex space-x-[8px] items-center">
              <div className="flex w-[16px] h-[16px] bg-[#6AB193] rounded-[8px] text-[13px] items-center justify-center text-[#ffffff] leading-0">
                <span>{getCommentCountByView(CommentView.AGREE)}</span>
              </div>
              <div className="flex w-[16px] h-[16px] bg-[#D29C13] rounded-[4px] text-[13px] items-center justify-center text-[#ffffff]">
                <span>{getCommentCountByView(CommentView.PARTIAL_AGREE)}</span>
              </div>
              <div className="flex w-[13px] h-[13px] bg-[#CB3535] text-[13px] items-center justify-center text-[#ffffff] rotate-45">
                <span className="rotate-[-45deg]">
                  {getCommentCountByView(CommentView.DISAGREE)}
                </span>
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center">
                <img
                  className="w-[24px] h-[24px] hover:cursor-pointer"
                  src={isLike ? "/heart-icon-blue.svg" : "/heart-icon.svg"}
                  alt="heart-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClickLike();
                  }}
                />
                <span className="wv-bold ml-[4px]">{comment.like_count}</span>
              </div>
              <div className="flex items-center ml-[20px]">
                <img
                  className="w-[24px] h-[24px] hover:cursor-pointer"
                  src="/comment-icon.svg"
                  alt="comment-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClickComment();
                  }}
                />
                <span className="wv-bold ml-[4px]">
                  {comment.comments.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
