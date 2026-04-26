import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    const hideTimer = setTimeout(() => setIsVisible(false), 3000);
    const closeTimer = setTimeout(() => onClose(), 3300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 inline-flex justify-center items-center h-[88px] pl-[138px] pr-[137px] bg-[#31111D99] rounded-[24px] backdrop-blur-[1px] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-[#FFF] text-[18px] font-medium leading-[135%] tracking-[-0.018px] whitespace-nowrap">
        {message}
      </span>
    </div>
  );
};

export default Toast;
