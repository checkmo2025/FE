// 공통된 라벨 및 인풋 스타일을 정의
import React, { useState } from "react";

interface JoinInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  hideLabel?: boolean;
}

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.84 0 1.68-.1 2.47-.28" />
    <path d="M2 2l20 20" />
  </svg>
);

const JoinInput: React.FC<JoinInputProps> = ({
  label,
  description,
  hideLabel,
  className,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

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
    <div className="flex flex-col items-start w-full gap-[12px]">
      {label && (
        <div className="flex items-center gap-[8px]">
          <span
            className={`text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px] ${hideLabel ? "sr-only" : ""
              }`}
          >
            {label}
          </span>
          {description && (
            <span className="text-Gray-4 body_2_2 font-sans truncate hidden t:block">
              {description}
            </span>
          )}
        </div>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          className={`w-full bg-white border rounded-[8px] outline-none ${!hasHeight ? "h-[44px]" : ""
            } ${!hasPx ? "px-[16px]" : ""} ${!hasPy ? "py-[12px]" : ""} ${className || ""
            } ${isPasswordType ? "pr-[40px]" : ""}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-[12px] transform -translate-y-1/2 text-[#BBB] hover:text-[#8D8D8D]"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinInput;
