// src/components/base-ui/Join/JoinLayout.tsx
import React from 'react';

interface JoinLayoutProps {
  children: React.ReactNode;
}

const JoinLayout: React.FC<JoinLayoutProps> = ({ children }) => {
  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center py-12"
      style={{ backgroundImage: `url('/Join_Background.png')` }}
    >
      <div className="relative z-10 w-11/12 md:max-w-3xl mx-auto bg-white rounded-lg shadow-lg flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default JoinLayout;
