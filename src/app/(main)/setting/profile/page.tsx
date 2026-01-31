import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export default function ProfileEditPage() {
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
      className="items-center gap-[20px] md:gap-[64px]" // gap 오버라이드
    >
      <div className="flex flex-col items-end self-stretch gap-[20px] md:gap-[40px]">
        <ProfileImageSection />

        {/* 닉네임 */}
        <div className="flex flex-col items-start gap-[12px] self-stretch">
          <label className="self-stretch body_1_2 text-primary-3">닉네임</label>
          <div className="flex items-center gap-[8px] self-stretch">
            <div className={`${inputContainerClass} flex-1`}>
              <input
                className={inputClass}
                placeholder="변경할 닉네임을 입력해주세요"
              />
            </div>
            <button className={checkBtnClass}>
              <span className={checkBtnTextClass}>중복확인</span>
            </button>
          </div>
        </div>

        {/* 소개, 이름, 전화번호 (반복 패턴) */}
        {["소개", "이름", "전화번호"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-start gap-[12px] self-stretch"
          >
            <label className="self-stretch body_1_2 text-primary-3">
              {label}
            </label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input
                className={inputClass}
                placeholder={
                  label === "소개"
                    ? "20자 이내로 작성해주세요"
                    : label === "전화번호"
                    ? "010-0000-0000"
                    : `${label}을 입력해주세요`
                }
              />
            </div>
          </div>
        ))}

        <CategorySelector />

        {/* 저장 버튼 */}
        <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]">
          <span className="text-[14px] font-semibold leading-[145%] tracking-[-0.014px] text-White">
            <span className="md:hidden">변경하기</span>
            <span className="hidden md:inline">저장하기</span>
          </span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}
