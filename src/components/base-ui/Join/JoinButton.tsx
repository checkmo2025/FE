import React from "react";

interface JoinButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const JoinButton: React.FC<JoinButtonProps> = ({
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}) => {
  const baseStyle =
    "flex justify-center items-center gap-[10px] rounded-[8px] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px] transition-colors";

  const variants = {
    primary: disabled
      ? "bg-[#DADADA] text-[#8D8D8D] cursor-not-allowed"
      : "bg-[#7B6154] text-[#FFF]",
    secondary: "bg-[#EAE5E2] text-[#5E4A40] border border-[#D2C5B6]",
  };

  // className에 width 관련 클래스가 없으면 기본값 적용
  const widthClass = className?.includes("w-") ? "" : "w-[526px]";
  return (
    <button
      className={`${baseStyle} ${widthClass} h-[48px] px-[16px] py-[12px] ${
        variants[variant]
      } ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default JoinButton;
