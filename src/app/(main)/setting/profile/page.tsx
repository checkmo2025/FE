"use client";

import { useAuthStore } from "@/store/useAuthStore";
import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfileEditPage() {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [intro, setIntro] = useState(user?.description || "");
  const [name, setName] = useState(user?.nickname || ""); // Assuming nickname is used for name if not separate
  const [phone, setPhone] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.categories || []
  );

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setIntro(user.description || "");
      setName(user.nickname || "");
      setSelectedCategories(user.categories || []);
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

  const handleSave = () => {
    console.log("Saving profile changes:", {
      nickname,
      intro,
      name,
      phone,
      selectedCategories,
    });
    // TODO: Connect to backend API for profile update
    toast.success("프로필 정보가 저장되었습니다.");
  };

  // 공통 스타일 상수
  const inputContainerClass =
    "flex items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px] h-[36px] md:h-[52px]";
  const inputClass =
    "w-full bg-transparent outline-none text-Gray-7 placeholder:text-Gray-3 text-[12px] font-normal leading-[145%] tracking-[-0.012px] md:body_1_3";
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
          profileImageUrl={user?.profileImageUrl}
        />

        {/* 닉네임 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">닉네임</label>
          <div className="flex items-center gap-[8px] self-stretch">
            <div className={`${inputContainerClass} flex-1`}>
              <input
                className={inputClass}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="변경할 닉네임을 입력해주세요"
              />
            </div>
            <button
              className={checkBtnClass}
              onClick={() => console.log("Check nickname duplicate")}
            >
              <span className={checkBtnTextClass}>중복확인</span>
            </button>
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
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">이름</label>
          <div className={`${inputContainerClass} self-stretch`}>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]"
        >
          <span className="text-[14px] font-semibold leading-[145%] tracking-[-0.014px] text-White">
            <span className="md:hidden">변경하기</span>
            <span className="hidden md:inline">저장하기</span>
          </span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}

