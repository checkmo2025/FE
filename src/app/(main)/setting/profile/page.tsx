"use client";

import { useAuthStore } from "@/store/useAuthStore";
import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "@/hooks/mutations/useMemberMutations";

export default function ProfileEditPage() {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [intro, setIntro] = useState(user?.description || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.categories || []
  );

  // Profile Image Upload States
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profileImageUrl || null
  );


  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setIntro(user.description || "");
      setName(user.name || "");
      setPhone(user.phoneNumber || "");
      setSelectedCategories(user.categories || []);
      setPreviewImage(user.profileImageUrl || null);
    }
  }, [user]);

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : prev.length < 6
          ? [...prev, category]
          : prev
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setProfileImageFile(null);
    setPreviewImage(null); // or set to default image URL if needed
  };

  const handleSave = () => {
    updateProfile({
      description: intro.slice(0, 20),
      categories: selectedCategories,
      profileImageFile,
      currentProfileImageUrl: previewImage,
    }, {
      onSuccess: () => {
        toast.success("프로필 정보가 저장되었습니다.");
      }
    });
  };

  // 공통 스타일 상수
  const inputContainerClass =
    "flex items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px] h-[36px] md:h-[52px]";
  const inputClass =
    "w-full bg-transparent outline-none text-Gray-7 placeholder:text-Gray-3 text-[12px] font-normal leading-[145%] tracking-[-0.012px] md:body_1_3 disabled:text-Gray-4 disabled:bg-transparent";
  const checkBtnClass =
    "flex items-center justify-center gap-[10px] rounded-[8px] border border-Subbrown-3 bg-Subbrown-4 h-[36px] w-[67px] md:h-[52px] md:w-[98px] xl:w-[132px]";
  const checkBtnTextClass =
    "text-primary-3 text-[12px] font-semibold leading-[145%] tracking-[-0.012px] md:body_1_3";

  return (
    <SettingsDetailLayout
      title="프로필 편집"
      className="items-center gap-[20px] md:gap-[64px]"
    >
      <div className="flex flex-col items-end self-stretch gap-[20px] md:gap-[40px]">
        <ProfileImageSection
          nickname={nickname}
          intro={intro}
          previewImage={previewImage}
          onUpload={handleImageUpload}
          onReset={handleResetImage}
        />

        {/* 닉네임 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">닉네임</label>
          <div className="flex flex-col gap-[4px] self-stretch">
            <div className={`${inputContainerClass} !bg-Gray-1 !border-Gray-3`}>
              <input
                className={inputClass}
                value={nickname}
                disabled={true}
                placeholder="닉네임"
              />
            </div>
            <span className="text-[12px] text-red-500 ml-1">닉네임 수정은 따로 문의해주세요!</span>
          </div>
        </div>

        {/* 소개 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">소개</label>
          <div className={`${inputContainerClass} self-stretch`}>
            <input
              className={inputClass}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="20자 이내로 작성해주세요"
              maxLength={20}
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">이름</label>
          <div className={`${inputContainerClass} self-stretch !bg-Gray-1 !border-Gray-3`}>
            <input
              className={inputClass}
              value={name}
              disabled={true}
              placeholder="이름을 입력해주세요"
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">전화번호</label>
          <div className={`${inputContainerClass} self-stretch`}>
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <CategorySelector
          selectedCategories={selectedCategories}
          onToggle={handleToggleCategory}
        />

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px] disabled:opacity-50"
        >
          <span className="text-[14px] font-semibold leading-[145%] tracking-[-0.014px] text-White">
            <span className="md:hidden">{isUpdating ? "변경 중..." : "변경하기"}</span>
            <span className="hidden md:inline">{isUpdating ? "변경 중..." : "저장하기"}</span>
          </span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}

