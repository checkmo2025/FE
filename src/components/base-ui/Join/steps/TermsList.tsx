/**
 * 약관 목록을 감싸는 회색 박스 영역.
 */
import React from "react";

interface TermsListProps {
  children: React.ReactNode;
}

const TermsList: React.FC<TermsListProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-[386px] p-10 gap-8 rounded-xl bg-background">
      {children}
    </div>
  );
};

export default TermsList;
