/**
 * 약관 목록을 감싸는 회색 박스 영역.
 */
import React from "react";

interface TermsListProps {
  children: React.ReactNode;
}

const TermsList: React.FC<TermsListProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-[270px] min-h-[280px] p-[20px] gap-[24px] md:w-full md:min-h-[386px] md:p-10 md:gap-10 rounded-xl bg-[#F9F7F6]">
      {children}
    </div>
  );
};

export default TermsList;
