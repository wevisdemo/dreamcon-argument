import { CommentView, Room } from "../types/room";

interface Props {
  room: Room;
  onClickAddComment: (roomId: string) => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
}
export default function MiniCard({
  room,
  onClickAddComment,
  onClickEdit,
  onClickDelete,
}: Props) {
  const getCommentCountByView = (view: CommentView) => {
    return (room.comments || []).filter((c) => c.comment_view === view).length;
  };

  const handleAddComment = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    onClickAddComment(room.id);
  };

  return (
    <a href={`/rooms/${room.id}`}>
      <div className="w-full h-full flex flex-col space-y-[16px] justify-between max-w-[320px] p-[16px] bg-[#FFFFFF] drop-shadow-md rounded-[8px]">
        <div className="flex flex-col space-y-[16px]">
          <div className="flex justify-end space-x-[8px]">
            <img
              src="/pen-icon.svg"
              alt="pen-icon"
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClickEdit();
              }}
            />
            <img
              src="/bin-icon.svg"
              alt="bin-icon"
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClickDelete();
              }}
            />
          </div>
          <span className="wv-ibmplex wv-bold text-[16px] leading-[20px]">
            {room.title}
          </span>
        </div>
        <div className="flex flex-col space-y-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="flex w-[16px] h-[16px] bg-[#6AB193] rounded-[8px] text-[13px] items-center justify-center text-[#ffffff] leading-0">
                <span>{getCommentCountByView(CommentView.AGREE)}</span>
              </div>
              <span className="text-[10px] ml-[4px]">เห็นด้วย</span>
            </div>
            <div className="flex">
              <div className="flex w-[16px] h-[16px] bg-[#D29C13] rounded-[4px] text-[13px] items-center justify-center text-[#ffffff]">
                <span>{getCommentCountByView(CommentView.PARTIAL_AGREE)}</span>
              </div>
              <span className="text-[10px] ml-[4px]">เห็นด้วยบางส่วน</span>
            </div>
            <div className="flex">
              <div className="flex w-[13px] h-[13px] bg-[#CB3535] text-[13px] items-center justify-center text-[#ffffff] rotate-45">
                <span className="rotate-[-45deg]">
                  {getCommentCountByView(CommentView.DISAGREE)}
                </span>
              </div>
              <span className="text-[10px] ml-[4px]">ไม่เห็นด้วย</span>
            </div>
          </div>
          <button
            onClick={handleAddComment}
            className="flex py-[10px] items-center justify-center w-full border-solid border-[2px] rounded-[48px] border-[#E8E8E8]"
          >
            <img src="/comment-icon.svg" alt="icon-add-comment" />
            <span className="wv-ibmplex wv-bold text-[16px] leading-[20px] ml-[8px]">
              เพิ่มความคิดเห็น
            </span>
          </button>
        </div>
      </div>
    </a>
  );
}
