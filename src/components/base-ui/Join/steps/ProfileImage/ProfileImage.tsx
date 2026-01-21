import React, { useRef } from "react";
import Image from "next/image";
import JoinHeader from "../../JoinHeader";
import JoinButton from "../../JoinButton";
import { useProfileImage, INTEREST_CATEGORIES } from "./useProfileImage";

interface ProfileImageProps {
  onNext?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onNext }) => {
  const {
    selectedInterests,
    profileImage,
    toggleInterest,
    handleResetImage,
    handleImageUpload,
    isValid,
  } = useProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="" />

      <div className="flex flex-col w-full mt-[67px] mb-[48px]">
        <div className="flex flex-col items-center w-[526px] gap-[42px] mx-auto">
          {/* 1. 프로필 이미지 섹션 */}
          <div className="flex flex-col items-center gap-[24px]">
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
                onChange={handleImageUpload}
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
                </svg>{" "}
              </button>
            </div>
            {/* 2. 기본 프로필 이미지 버튼 */}
            <button
              onClick={handleResetImage}
              className="px-[20px] py-[10px] rounded-[8px] bg-[#5E4A40] text-[#FFF] text-[18px] font-medium leading-[135%] tracking-[-0.018px]"
            >
              기본 프로필 이미지
            </button>
          </div>

          {/* 3. 관심 카테고리 섹션 */}
          <div className="flex flex-col w-full gap-[16px]">
            <div className="flex flex-row items-center gap-[10px]">
              <span className="text-[#7B6154] font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                관심 카테고리
              </span>
              <div className="flex h-[27px] p-[10px] justify-center items-center gap-[10px]">
                <span className="text-[#8D8D8D] font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]">
                  (최소 1개, 최대 6개 선택)
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-[12px]">
              {INTEREST_CATEGORIES.map((category) => {
                const isSelected = selectedInterests.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleInterest(category)}
                    className={`w-[122px] h-[44px] flex justify-center items-center rounded-[400px] text-[14px] leading-[145%] tracking-[-0.014px] transition-colors ${
                      isSelected
                        ? "bg-[#A19182] border border-[#D2C5B6] text-[#FFF] font-medium"
                        : "bg-[#F9F7F6] border border-[#D2C5B6] text-[#5C5C5C] font-normal"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <JoinButton onClick={onNext} disabled={!isValid}>
        다음
      </JoinButton>
    </div>
  );
};

export default ProfileImage;
