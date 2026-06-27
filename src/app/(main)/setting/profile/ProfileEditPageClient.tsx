"use client";

import { useAuthStore } from "@/store/useAuthStore";
import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "@/hooks/mutations/useMemberMutations";
import { authService } from "@/services/authService";

export default function ProfileEditPageClient() {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  // 현재 닉네임은 기본적으로 통과 상태(변경 시에만 중복확인 필요)
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [nicknameStatus, setNicknameStatus] = useState<"idle" | "available" | "duplicate">("idle");
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

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setIsNicknameChecked(true);
      setNicknameStatus("idle");
      setIntro(user.description || "");
      setName(user.name || "");
      setPhone(formatPhoneNumber(user.phoneNumber || ""));
      setSelectedCategories(user.categories || []);
      setPreviewImage(user.profileImageUrl || null);
    }
  }, [user]);

  // 닉네임 입력: 영어 소문자/숫자/특수문자, 최대 20자 (회원가입 규칙과 동일)
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .replace(/[^a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "")
      .slice(0, 20);
    setNickname(filtered);
    // 현재 닉네임과 같으면 통과, 다르면 중복확인 필요
    setIsNicknameChecked(filtered === (user?.nickname || ""));
    setNicknameStatus("idle");
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    // 본인 현재 닉네임이면 중복으로 처리하지 않음
    if (nickname === (user?.nickname || "")) {
      setIsNicknameChecked(true);
      setNicknameStatus("idle");
      toast.success("현재 사용 중인 닉네임입니다.");
      return;
    }
    try {
      const response = await authService.checkNickname(nickname);
      // result: false = 사용 가능, true = 중복
      if (response.isSuccess && response.result === false) {
        setIsNicknameChecked(true);
        setNicknameStatus("available");
        toast.success("사용 가능한 닉네임입니다.");
      } else {
        setIsNicknameChecked(false);
        setNicknameStatus("duplicate");
        toast.error("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      setIsNicknameChecked(false);
      const message = error instanceof Error ? error.message : "닉네임 확인 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : prev.length < 6
          ? [...prev, category]
          : prev
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
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
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    const nicknameChanged = nickname !== (user?.nickname || "");
    if (nicknameChanged && !isNicknameChecked) {
      toast.error("닉네임 중복확인을 해주세요!");
      return;
    }
    updateProfile({
      nickname,
      description: intro.slice(0, 20),
      categories: selectedCategories,
      phoneNumber: phone,
      profileImageFile,
      currentProfileImageUrl: previewImage,
    }, {
      onSuccess: () => {
        toast.success("프로필 정보가 저장되었습니다.");
      },
      onError: (error: Error) => {
        // 닉네임 중복 등 서버 에러(MEMBER_416 등)는 백엔드 메시지를 그대로 노출
        toast.error(error?.message ?? "프로필 저장에 실패했습니다.");
      },
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
            <div className="flex items-center gap-[8px] self-stretch">
              <div className={`${inputContainerClass} flex-1`}>
                <input
                  className={inputClass}
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="영어 소문자/숫자/특수문자, 최대 20자"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={!nickname || isNicknameChecked}
                className={`${checkBtnClass} shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={checkBtnTextClass}>{isNicknameChecked ? "확인됨" : "중복확인"}</span>
              </button>
            </div>
            {nickname !== (user?.nickname || "") && (
              <span
                className={`text-[12px] ml-1 ${
                  nicknameStatus === "available"
                    ? "text-green-600"
                    : nicknameStatus === "duplicate"
                      ? "text-red-500"
                      : "text-Gray-4"
                }`}
              >
                {nicknameStatus === "available"
                  ? "사용 가능한 닉네임입니다."
                  : nicknameStatus === "duplicate"
                    ? "이미 사용 중인 닉네임입니다."
                    : "닉네임 중복확인을 해주세요."}
              </span>
            )}
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
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
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
          className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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

