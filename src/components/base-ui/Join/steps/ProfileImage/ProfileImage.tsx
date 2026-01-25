import React from "react";
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

  return (
    <div className="relative flex flex-col items-center w-[766px] px-[56px] py-[99px] bg-white rounded-[8px]">
      <JoinHeader title="" />

      <div className="flex flex-col w-full mt-[67px] mb-[48px]">
        <div className="flex flex-col items-center w-[526px] gap-[42px] mx-auto">
          <ProfileImageUploader
            profileImage={profileImage}
            onUpload={handleImageUpload}
            onReset={handleResetImage}
          />
          <InterestCategorySelector
            selectedInterests={selectedInterests}
            onToggle={toggleInterest}
          />
        </div>
      </div>

      <JoinButton onClick={onNext} disabled={!isValid}>
        다음
      </JoinButton>
    </div>
  );
};

export default ProfileImage;
