// src/components/base-ui/Join/JoinHeader.tsx
import React from 'react';
import Image from 'next/image';

interface JoinHeaderProps {
  title?: string;
}

const JoinHeader: React.FC<JoinHeaderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[526px] space-y-6">
      <Image src="/profile.svg" alt="Profile Icon" width={40} height={40} />
      {title && (
        <h2 className="subhead_1 text-primary-1">{title}</h2>
      )}
    </div>
  );
};

export default JoinHeader;
