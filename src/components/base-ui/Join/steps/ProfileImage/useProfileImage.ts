import { useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";

export const INTEREST_CATEGORIES = [
  "소설/시/희곡",
  "에세이",
  "인문학",
  "사회과학",
  "정치/외교/국방",
  "경제/경영",
  "자기계발",
  "역사/문화",
  "과학",
  "컴퓨터/IT",
  "예술/대중문화",
  "여행",
  "외국어",
  "어린이/청소년",
  "종교/철학",
];

export const useProfileImage = () => {
  const {
    selectedInterests,
    setSelectedInterests,
    profileImage,
    setProfileImage,
    isProfileImageSet,
    setIsProfileImageSet,
    showToast,
  } = useSignup();

  const toggleInterest = (category: string) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter((c) => c !== category));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, category]);
      } else {
        showToast("카테고리는 최대 6개까지 선택 가능합니다.");
      }
    }
  };

  const handleResetImage = () => {
    setProfileImage("/default_profile_1.svg");
    setIsProfileImageSet(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setIsProfileImageSet(true);
    }
  };

  // 메모리 누수 방지를 위한 cleanup
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const isValid = selectedInterests.length >= 1 && selectedInterests.length <= 6;

  return {
    selectedInterests,
    profileImage,
    isProfileImageSet,
    toggleInterest,
    handleResetImage,
    handleImageUpload,
    isValid,
  };
};
