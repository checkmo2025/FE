// src/components/base-ui/Join/JoinLayout.tsx
import React from "react";

interface JoinLayoutProps {
  children: React.ReactNode;
}

const JoinLayout: React.FC<JoinLayoutProps> = ({ children }) => {
  return (
    <div
      className="relative flex items-center justify-center w-screen h-screen bg-center bg-cover"
      style={{ backgroundImage: `url('/Join_Background.png')` }}
    >
      {/* Background Image */}
      {/* <Image
        src="/Join_Background.png"
        alt="Join Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      /> */}

      {/* White Container */}
      <div className="relative z-10 w-full max-w-[766px] bg-white rounded-lg shadow-lg flex flex-col my-12">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
