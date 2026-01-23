// src/components/base-ui/Join/JoinButton.tsx
import React from 'react';

interface JoinButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const JoinButton: React.FC<JoinButtonProps> = ({ onClick, children, disabled = false }) => {
  const baseClasses = "w-full max-w-[526px] h-[48px] p-[12px_16px] flex justify-center items-center gap-[10px] rounded-[8px] transition-colors";
  const enabledClasses = "bg-primary-1 text-white";
  const disabledClasses = "bg-[#DADADA] text-[#8D8D8D] cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
    >
      {children}
    </button>
  );
};

export default JoinButton;
