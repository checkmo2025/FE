"use client";

import { useAuthStore } from "@/store/useAuthStore";
import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/authService"; // API call
import { useUpdateProfileMutation } from "@/hooks/mutations/useMemberMutations";

export default function ProfileEditPage() {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [intro, setIntro] = useState(user?.description || "");
  const [name, setName] = useState(user?.nickname || ""); // Assuming nickname is used for name if not separate
  const [phone, setPhone] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.categories || []
  );

  // Profile Image Upload States
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profileImageUrl || null
  );

  // Nickname Duplicate Check State
  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // default true for existing user

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setIntro(user.description || "");
      // 백엔드 명세상 email 외에 name 속성이 별도로 user 데이터에 있다면 그걸 쓰는게 맞지만, 현재 auth의 User 타입엔 없으므로 일단 nickname
      setName(user.nickname || "");
      setSelectedCategories(user.categories || []);
      setPreviewImage(user.profileImageUrl || null);
      // Reset check state if it matches original
      setIsNicknameChecked(true);
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

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 회원가입과 동일한 닉네임 필터 로직: 영어 소문자 및 특수문자, 숫자만 사용 가능, 최대 20글자
    const filteredValue = value.replace(/[^a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "").slice(0, 20);
    setNickname(filteredValue);

    // 만약 원래 닉네임과 같다면 중복 확인 된 것으로 간주
    if (user && filteredValue === user.nickname) {
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(false);
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      toast.error("닉네임을 입력해주세요!");
      return;
    }

    // 본인 닉네임과 동일하면 체크할 필요 없음
    if (user && nickname === user.nickname) {
      setIsNicknameChecked(true);
      toast.success("기존 닉네임과 동일하므로 사용 가능합니다.");
      return;
    }

    try {
      const response = await authService.checkNickname(nickname);
      // Backend Spec: result: false (not duplicated/available), result: true (duplicated/taken)
      if (response.isSuccess && response.result === false) {
        setIsNicknameChecked(true);
        toast.success("사용 가능한 닉네임입니다.");
      } else {
        toast.error("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      }
    } catch (error: any) {
      toast.error(error.message || "닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSave = () => {
    if (!isNicknameChecked) {
      toast.error("닉네임 중복확인을 해주세요!");
      return;
    }

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
          <div className="flex items-center gap-[8px] self-stretch">
            <div className={`${inputContainerClass} flex-1`}>
              <input
                className={inputClass}
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="변경할 닉네임을 입력해주세요"
              />
            </div>
            <button
              className={checkBtnClass}
              onClick={handleCheckNickname}
            >
              <span className={checkBtnTextClass}>
                {isNicknameChecked ? "확인완료" : "중복확인"}
              </span>
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

