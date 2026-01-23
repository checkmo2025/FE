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
      <div className="relative flex flex-col items-center w-[352px] h-[720px] px-[41px] md:w-[calc(100%-80px)] md:max-w-[766px] md:h-auto md:min-h-0 md:px-0 md:py-[99px] md:gap-0 rounded-xl bg-white shadow-lg mx-auto">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
