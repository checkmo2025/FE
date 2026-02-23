import { useEffect, useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";
import { CATEGORY_MAP } from "@/constants/categories";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setSelectedFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setIsProfileImageSet(true);
      setSelectedFile(file);
    }
  };

  const handleFinish = async (onSuccess?: () => void) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let finalImageUrl = "";

      // 1. If a new image is selected, upload to S3 using Presigned URL
      if (selectedFile) {
        const presignedResponse = await authService.getPresignedUrl(
          "PROFILE",
          selectedFile.name,
          selectedFile.type
        );

        if (presignedResponse.isSuccess && presignedResponse.result) {
          const { presignedUrl, imageUrl } = presignedResponse.result;
          await authService.uploadToS3(presignedUrl, selectedFile);
          finalImageUrl = imageUrl;
        } else {
          showToast(presignedResponse.message || "이미지 업로드 준비 중 오류가 발생했습니다.");
          setIsLoading(false);
          return;
        }
      } else if (imgUrl && !imgUrl.startsWith("blob:") && !imgUrl.includes("default_profile")) {
        // Already uploaded URL (e.g. from previous attempt or social)
        finalImageUrl = imgUrl;
      }

      // 2. Submit all info to additional-info endpoint
      const categories = selectedInterests.map((c: string) => CATEGORY_MAP[c] || c);

      await authService.additionalInfo({
        nickname,
        name,
        phoneNumber,
        description,
        profileImageUrl: finalImageUrl,
        categories,
      });

      onSuccess?.();
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
