import React from "react";

interface JoinButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const JoinButton: React.FC<JoinButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className={`flex justify-center items-center gap-[10px] w-[526px] h-[48px] px-[16px] py-[12px] rounded-[8px] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] transition-colors
      ${
        props.disabled
          ? "bg-[#DADADA] text-[#8D8D8D] cursor-not-allowed"
          : "bg-[#7B6154] text-[#FFF]"
      }
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default JoinButton;
