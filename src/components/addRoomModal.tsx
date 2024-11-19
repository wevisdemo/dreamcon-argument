import { AddRoomPayload } from "../types/room";
import { on } from "events";
import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (payload: AddRoomPayload) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAddRoom }) => {
  const [text, setText] = React.useState("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getConfirmStyle = () =>
    text
      ? "rounded-[48px] py-[10px] px-[16px] bg-[#2579F5] text-16 text-white wv-ibmplex wv-bold leading-[19px] shadow-md"
      : "rounded-[48px] py-[10px] px-[16px] bg-[#E8E8E8] text-16 text-[#979797] wv-ibmplex wv-bold leading-[19px]";

  const onSubmit = () => {
    onAddRoom({ title: text });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full h-full md:h-[480px] md:max-w-[480px] bg-white md:rounded-lg shadow-lg">
        <div className="flex justify-between px-[16px] py-[12px] border-solid border-b-[1px] border-[#D4D4D4]">
          <button
            className="py-[10px] px-[16px] text-16 wv-ibmplex wv-bold "
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className={getConfirmStyle()}
            onClick={onSubmit}
            disabled={text === ""}
          >
            โพสต์
          </button>
        </div>
        <div className="p-[16px] h-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full md:h-[360px] resize-none focus:outline-none"
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
