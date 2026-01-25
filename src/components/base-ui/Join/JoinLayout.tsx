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
      <div className="flex flex-col items-center w-[766px] px-[56px] py-[99px] gap-[100px] rounded-[8px] bg-White">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
