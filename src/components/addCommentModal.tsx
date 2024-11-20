import { AddCommentPayload, CommentView, Comment } from "../types/room";
import React, { useEffect } from "react";

interface ModalProps {
  isEdit?: boolean;
  isOpen: boolean;
  onClose: () => void;
  submitComment: (payload: AddCommentPayload) => void;
  defaultState?: Comment;
}

const Modal: React.FC<ModalProps> = ({
  isEdit,
  isOpen,
  onClose,
  submitComment,
  defaultState,
}) => {
  const [text, setText] = React.useState<string>("");
  const [commentView, setCommentView] = React.useState<CommentView | null>(
    null
  );
  useEffect(() => {
    setText(defaultState?.reason || "");
    setCommentView(defaultState?.comment_view || null);
  }, [defaultState]);
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setText("");
    setCommentView(null);
    onClose();
  };

  const getConfirmStyle = () =>
    !isPostDisabled()
      ? "rounded-[48px] py-[10px] px-[16px] bg-[#2579F5] text-16 text-white wv-ibmplex wv-bold leading-[19px] shadow-md"
      : "rounded-[48px] py-[10px] px-[16px] bg-[#E8E8E8] text-16 text-[#979797] wv-ibmplex wv-bold leading-[19px]";

  const isPostDisabled = () => text === "" || commentView === null;

  const getCommentViewStyle =
    "rounded-[48px] py-[10px] px-[16px] text-[13px] leading-[13px] border-[1px]";

  const getCommentViewColor = (view: CommentView) => {
    switch (view) {
      case CommentView.AGREE:
        return "#6AB193";
      case CommentView.PARTIAL_AGREE:
        return "#D29C13";
      case CommentView.DISAGREE:
        return "#CB3535";
    }
  };

  const onSubmit = () => {
    if (commentView && text) {
      submitComment({
        comment_view: commentView,
        reason: text,
      });
    }
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col w-full h-full md:h-[480px] md:max-w-[480px] bg-white md:rounded-lg shadow-lg ">
        <div className="flex justify-between px-[16px] py-[12px] border-solid border-b-[1px] border-[#D4D4D4]">
          <button
            className="py-[10px] px-[16px] pl-0 text-16 wv-ibmplex wv-bold "
            onClick={handleClose}
          >
            ยกเลิก
          </button>
          <button
            className={getConfirmStyle()}
            onClick={onSubmit}
            disabled={text === "" || commentView === null}
          >
            {isEdit ? "แก้ไข" : "โพสต์"}
          </button>
        </div>
        <div className="p-[16px] flex flex-col space-y-[8px]">
          <p>คุณคิดอย่างไรกับข้อถกเถียงนี้</p>
          <div className="flex space-x-[8px]">
            <button
              className={getCommentViewStyle}
              style={{
                borderColor: getCommentViewColor(CommentView.AGREE),
                color:
                  commentView === CommentView.AGREE
                    ? "#FFFFFF"
                    : getCommentViewColor(CommentView.AGREE),
                backgroundColor:
                  commentView === CommentView.AGREE
                    ? getCommentViewColor(CommentView.AGREE)
                    : "transparent",
              }}
              onClick={() => setCommentView(CommentView.AGREE)}
            >
              เห็นด้วย
            </button>
            <button
              className={getCommentViewStyle}
              style={{
                borderColor: getCommentViewColor(CommentView.PARTIAL_AGREE),
                color:
                  commentView === CommentView.PARTIAL_AGREE
                    ? "#FFFFFF"
                    : getCommentViewColor(CommentView.PARTIAL_AGREE),
                backgroundColor:
                  commentView === CommentView.PARTIAL_AGREE
                    ? getCommentViewColor(CommentView.PARTIAL_AGREE)
                    : "transparent",
              }}
              onClick={() => setCommentView(CommentView.PARTIAL_AGREE)}
            >
              เห็นด้วยบ้าง
            </button>
            <button
              className={getCommentViewStyle}
              style={{
                borderColor: getCommentViewColor(CommentView.DISAGREE),
                color:
                  commentView === CommentView.DISAGREE
                    ? "#FFFFFF"
                    : getCommentViewColor(CommentView.DISAGREE),
                backgroundColor:
                  commentView === CommentView.DISAGREE
                    ? getCommentViewColor(CommentView.DISAGREE)
                    : "transparent",
              }}
              onClick={() => setCommentView(CommentView.DISAGREE)}
            >
              ไม่เห็นด้วย
            </button>
          </div>
        </div>
        <div className="p-[16px] h-full">
          <span className="text-[#6E6E6E]">{text.length}/140</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full resize-none focus:outline-none"
            name="topic"
            id="topic"
            placeholder="คุณมีข้อถกเถียงว่า... &#10;ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
            maxLength={140}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Modal;
