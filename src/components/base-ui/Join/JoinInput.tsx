// 공통된 라벨 및 인풋 스타일을 정의
import React from "react";

interface JoinInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const JoinInput: React.FC<JoinInputProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-[12px]">
      <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
        {label}
      </span>
      <input
        className={`w-full h-[44px] px-[16px] py-[12px] bg-white border rounded-[8px] outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default JoinInput;
