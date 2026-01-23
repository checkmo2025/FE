import { useState, useEffect } from "react";

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(
    "/default_profile_1.svg"
  );

  const toggleInterest = (category: string) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests((prev) => prev.filter((c) => c !== category));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests((prev) => [...prev, category]);
      }
    }
  };

  const handleResetImage = () => {
    setProfileImage("/default_profile_1.svg");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
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

  const isValid = selectedInterests.length >= 1;

  return {
    selectedInterests,
    profileImage,
    toggleInterest,
    handleResetImage,
    handleImageUpload,
    isValid,
  };
};
