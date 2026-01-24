"use client";

import React, { useState, useEffect } from "react";
import JoinHeader from "../../JoinHeader";
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
      setIsMobile(window.innerWidth < 768);
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

  // Dynamic Header Title based on Mobile Step
  const headerTitle = isMobile
    ? mobileStep === "image"
      ? "프로필 설정"
      : "관심 카테고리"
    : "";

  return (
    <div className="relative flex flex-col items-center mx-auto w-full max-w-[766px] bg-white rounded-[8px] px-6 py-10 md:px-[40px] md:py-[60px] lg:px-[56px] lg:py-[99px]">
      <JoinHeader title={headerTitle} />

      {/* Content Wrapper: Reduced Desktop Spacing (lg:mt-[50px] lg:mb-[80px]) */}
      <div className="flex flex-col w-full mt-10 mb-10 md:mt-[60px] md:mb-[80px] lg:mt-[50px] lg:mb-[80px]">
        <div className="flex flex-col items-center w-full max-w-[526px] gap-10 md:gap-[42px] mx-auto">
          {/* Profile Image Uploader: Visible on Desktop OR Mobile Step 1 */}
          <div
            className={`${
              mobileStep === "image" ? "flex" : "hidden"
            } md:flex flex-col w-full items-center`}
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
            } md:flex flex-col w-full`}
          >
            <InterestCategorySelector
              selectedInterests={selectedInterests}
              onToggle={toggleInterest}
            />
          </div>
        </div>
      </div>

      <JoinButton
        onClick={handleNextClick}
        disabled={isButtonDisabled}
        className="w-full md:w-[526px]"
      >
        다음
      </JoinButton>
    </div>
  );
};

export default ProfileImage;
