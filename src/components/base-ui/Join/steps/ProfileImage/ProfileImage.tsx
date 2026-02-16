"use client";

import React, { useState, useEffect } from "react";
import JoinLayout from "../../JoinLayout";
import JoinButton from "../../JoinButton";
import { useProfileImage } from "./useProfileImage";
import ProfileImageUploader from "./ProfileImageUploader";
import InterestCategorySelector from "./InterestCategorySelector";
import { useSignup } from "@/contexts/SignupContext";

interface ProfileImageProps {
  onNext?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onNext }) => {
  const {
    selectedInterests,
    profileImage,
    isProfileImageSet,
    toggleInterest,
    handleResetImage,
    handleImageUpload,
    isValid,
  } = useProfileImage();
  const { showToast } = useSignup();

  const [mobileStep, setMobileStep] = useState<"image" | "interest">("image");
  const [isMobile, setIsMobile] = useState(false);
  const interestRef = React.useRef<HTMLDivElement>(null);

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
    // 1. 프로필 사진 업로드 안하거나, 기본 프로필 사진 사용 클릭 안하고 다음 버튼 클릭시
    if (!isProfileImageSet && (isMobile ? mobileStep === "image" : true)) {
      showToast("프로필 사진을 입력해주세요!");
      return;
    }

    if (isMobile && mobileStep === "image") {
      setMobileStep("interest");
      return;
    }

    // 2. 관심 독서 카테고리를 선택하지 않고 다음 버튼 클릭시
    if (selectedInterests.length === 0) {
      showToast("관심 독서 카테고리를 최소 1개 선택해주세요!");
      interestRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (isValid) {
      onNext?.();
    }
  };

  // Logic for disabling the button
  // 버튼은 항상 활성화 해두고 클릭 시 토스트로 피드백 (기능 명세에 '필수 입력 필드 채워졌을 때 활성화'라고 되어있으나 
  // 토스트 피드백을 보여주기 위해 클릭 가능하게 유지하는 것이 일반적인 UI 패턴임. 
  // 만약 비활성화가 우선이라면 토스트를 보여줄 수 없음.)
  const isButtonDisabled = false;

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
            className={`${mobileStep === "image" ? "flex" : "hidden"
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
            ref={interestRef}
            className={`${mobileStep === "interest" ? "flex" : "hidden"
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
