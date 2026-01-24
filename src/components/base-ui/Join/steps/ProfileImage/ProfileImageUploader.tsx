import React, { useRef } from "react";
import Image from "next/image";

interface ProfileImageUploaderProps {
  profileImage: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  profileImage,
  onUpload,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-[24px] w-full">
      <div className="relative w-[148px] h-[141px]">
        <div className="w-[138px] h-[138px] rounded-full overflow-hidden bg-gray-200">
          <Image
            src={profileImage || "/default_profile_1.svg"}
            alt="Profile"
            width={138}
            height={138}
            className="object-cover"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onUpload}
          className="hidden"
        />
        <button
          onClick={handleEditClick}
          className="absolute bottom-0 right-0 p-[10px] rounded-[79px] bg-[#5E4A40] flex justify-center items-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2L22 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 20.5L19 9L15 5L3.5 16.5L2 22L7.5 20.5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <button
        onClick={onReset}
        className="px-[20px] py-[10px] rounded-[8px] bg-[#5E4A40] text-[#FFF] text-[18px] font-medium leading-[135%] tracking-[-0.018px]"
      >
        기본 프로필 이미지
      </button>
    </div>
  );
};

export default ProfileImageUploader;
