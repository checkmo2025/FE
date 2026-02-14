"use client";

import React, { useState, useEffect } from "react";
import JoinLayout from "../../JoinLayout";
import JoinButton from "../../JoinButton";
import { useProfileImage } from "./useProfileImage";
import ProfileImageUploader from "./ProfileImageUploader";
import InterestCategorySelector from "./InterestCategorySelector";

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

  const [mobileStep, setMobileStep] = useState<"image" | "interest">("image");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px matches 't:' breakpoint
    };

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNextClick = () => {
    if (isMobile && mobileStep === "image") {
      setMobileStep("interest");
    } else {
      onNext?.();
    }
  };

  // Logic for disabling the button
  // Desktop: !isValid (must select at least 1 interest)
  // Mobile Step 1 (Image): Always enabled (image is optional or default provided)
  // Mobile Step 2 (Interest): !isValid
  const isButtonDisabled = isMobile
    ? mobileStep === "interest" && !isValid
    : !isValid;

  // Dynamic Header Title
  const headerTitle = isMobile
    ? mobileStep === "interest"
      ? "관심 카테고리"
      : "프로필 선택"
    : "";

  return (
    <JoinLayout title={headerTitle} desktopGap="t:gap-[60px]">
      <div className="flex flex-col items-center w-full gap-[40px] t:gap-[60px]">
        {/* Content Container */}
        <div className="flex flex-col items-center w-[272px] t:w-[526px] gap-[40px] t:gap-[42px]">
          {/* Profile Image Uploader: Visible on Desktop OR Mobile Step 1 */}
          <div
            className={`${
              mobileStep === "image" ? "flex" : "hidden"
            } t:flex flex-col w-full items-center`}
          >
            <ProfileImageUploader
              profileImage={profileImage}
              onUpload={handleImageUpload}
              onReset={handleResetImage}
            />
          </div>

          {/* Interest Selector: Visible on Desktop OR Mobile Step 2 */}
          <div
            className={`${
              mobileStep === "interest" ? "flex" : "hidden"
            } t:flex flex-col w-full`}
          >
            <InterestCategorySelector
              selectedInterests={selectedInterests}
              onToggle={toggleInterest}
            />
          </div>
        </div>

        <JoinButton
          onClick={handleNextClick}
          disabled={isButtonDisabled}
          className="w-[272px] t:w-[526px]"
        >
          {isMobile && mobileStep === "image" ? "다음" : "가입 완료"}
        </JoinButton>
      </div>
    </JoinLayout>
  );
};

export default ProfileImage;
