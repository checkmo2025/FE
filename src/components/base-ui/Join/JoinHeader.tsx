import React from "react";
import Image from "next/image";

interface JoinHeaderProps {
  title?: string;
}

const JoinHeader: React.FC<JoinHeaderProps> = ({ title = "약관 동의" }) => {
  return (
    <div className="flex flex-col items-center w-[146px] gap-[24px] mx-auto">
      <Image
        src="/Vector.svg"
        alt="CheckMo Logo"
        width={76.607}
        height={46.815}
        className="w-[76.607px] h-[46.815px]"
      />
      <h2 className="self-stretch text-center font-sans text-[24px] font-semibold leading-[1.35] tracking-[-0.024px] text-[#7B6154]">
        {title}
      </h2>
    </div>
  );
};

export default JoinHeader;
