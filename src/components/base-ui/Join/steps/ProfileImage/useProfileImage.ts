import { useEffect, useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";

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

const CATEGORY_MAP: Record<string, string> = {
  "소설/시/희곡": "FICTION_POETRY_DRAMA",
  "에세이": "ESSAY",
  "인문학": "HUMANITIES",
  "사회과학": "SOCIAL_SCIENCE",
  "정치/외교/국방": "POLITICS_DIPLOMACY_DEFENSE",
  "경제/경영": "ECONOMY_MANAGEMENT",
  "자기계발": "SELF_DEVELOPMENT",
  "역사/문화": "HISTORY_CULTURE",
  "과학": "SCIENCE",
  "컴퓨터/IT": "COMPUTER_IT",
  "예술/대중문화": "ART_POP_CULTURE",
  "여행": "TRAVEL",
  "외국어": "FOREIGN_LANGUAGE",
  "어린이/청소년": "CHILDREN_BOOKS",
  "종교/철학": "RELIGION_PHILOSOPHY",
};

export const useProfileImage = () => {
  const {
    nickname,
    name,
    phone: phoneNumber,
    intro: description,
    selectedInterests,
    setSelectedInterests,
    profileImage: imgUrl,
    setProfileImage,
    isProfileImageSet,
    setIsProfileImageSet,
    showToast,
  } = useSignup();

  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (category: string) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter((c: string) => c !== category));
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

  const handleFinish = async (onSuccess?: () => void) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const categories = selectedInterests.map((c: string) => CATEGORY_MAP[c] || c);

      const response = await authService.additionalInfo({
        nickname,
        name,
        phoneNumber,
        description,
        imgUrl: imgUrl || "",
        categories,
      });

      if (response.isSuccess) {
        onSuccess?.();
      }
    } catch (error: any) {
      showToast(error.message || "정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imgUrl && imgUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);

  const isValid = selectedInterests.length >= 1 && selectedInterests.length <= 6;

  return {
    selectedInterests,
    profileImage: imgUrl,
    isProfileImageSet,
    toggleInterest,
    handleResetImage,
    handleImageUpload,
    handleFinish,
    isLoading,
    isValid,
  };
};
