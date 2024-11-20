import React from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col space-y-[24px] w-full p-[16px] h-full md:h-auto md:max-w-[272px] bg-white md:rounded-lg shadow-lg">
        <div className="flex justify-between">
          <span className="wv-ibmplex wv-bold text-[16px]">{title}</span>
          <img
            className="w-[14px] hover:cursor-pointer"
            src="/close-icon.svg"
            alt="close-icon"
            onClick={handleClose}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="w-[116px] py-[10px] wv-ibmplex wv-bold text-[16px] border-solid border-[2px] rounded-[48px] border-[#454343]"
            onClick={handleClose}
          >
            ยกเลิก
          </button>
          <button
            className="flex justify-center space-x-[8px] w-[116px] py-[10px] wv-ibmplex wv-bold text-[16px] border-solid border-[2px] rounded-[48px] border-[#454343] bg-[#CB3535]"
            onClick={handleConfirm}
          >
            <span className="wv-ibmplex wv-bold text-[16px] text-white">
              ลบ
            </span>
            <img src="/bin-icon-white.svg" alt="bin-icon-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
