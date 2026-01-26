// TermsList.tsx

/**
 * 약관 목록을 감싸는 회색 박스 영역.
 */
import React from "react";

interface TermsListProps {
  children: React.ReactNode;
}

const TermsList: React.FC<TermsListProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-[280px] gap-6 rounded-xl bg-[#F9F7F6] md:min-h-[386px] md:gap-10 p-5 md:p-[30px] lg:p-[40px]">
      {children}
    </div>
  );
};

export default TermsList;
