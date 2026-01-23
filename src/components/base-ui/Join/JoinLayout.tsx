// JoinLayout.tsx

import React from "react";

interface JoinLayoutProps {
  children: React.ReactNode;
}

const JoinLayout: React.FC<JoinLayoutProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen pb-[75px] bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      {/* 
        Container Layout Rules:
        - Mobile: Fixed w-[352px], Fluid px-[24px]
        - Desktop: Fixed w-[766px], Strict Padding px-[56px] py-[99px]
      */}
      <div className="relative flex flex-col items-center w-[352px] h-[720px] px-[24px] md:w-[766px] md:h-auto md:min-h-0 md:px-[56px] md:py-[99px] md:gap-0 rounded-xl bg-white shadow-lg mx-auto">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
