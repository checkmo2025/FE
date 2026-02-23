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
      : "bg-[#7B6154] text-[#FFF] hover:bg-[#7B6154] hover:text-[#FFF]",
    secondary: "bg-[#EAE5E2] text-[#5E4A40] border border-[#D2C5B6]",
  };

  // Determine classes to avoid conflicts with className prop
  const hasWidth = className?.includes("w-");
  const hasHeight = className?.includes("h-");
  const hasPx =
    className?.includes("px-") ||
    className?.includes("pl-") ||
    className?.includes("pr-") ||
    className?.includes("p-");
  const hasPy =
    className?.includes("py-") ||
    className?.includes("pt-") ||
    className?.includes("pb-") ||
    className?.includes("p-");

  return (
    <button
      className={`${baseStyle} ${!hasWidth ? "w-[526px]" : ""} ${!hasHeight ? "h-[48px]" : ""
        } ${!hasPx ? "px-[16px]" : ""} ${!hasPy ? "py-[12px]" : ""} ${variants[variant]
        } ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default JoinButton;
