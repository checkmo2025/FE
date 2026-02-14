// JoinLayout.tsx

import React from "react";
import JoinHeader from "./JoinHeader";

interface JoinLayoutProps {
  children: React.ReactNode;
  title?: string;
  desktopGap?: string;
}

const JoinLayout: React.FC<JoinLayoutProps> = ({ children, title, desktopGap = "t:gap-[100px]" }) => {
  return (
    <div className={`relative flex flex-col items-center mx-auto bg-white shadow-lg rounded-[8px] w-[352px] h-[650px] px-[24px] py-[40px] gap-[40px] t:w-[700px] t:h-[1004px] t:px-[56px] t:py-[99px] ${desktopGap}`}>
      <JoinHeader title={title} />
      <div className="flex flex-col items-center w-full">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
