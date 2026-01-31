import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";

export default function ProfileEditPage() {
  const inputContainerClass = `flex items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px] h-[36px] md:h-[52px]`;
  const inputClass = `w-full bg-transparent outline-none text-Gray-7 placeholder:text-Gray-3 text-[12px] font-normal leading-[145%] tracking-[-0.012px] md:body_1_3`;
  const checkButtonClass = `flex items-center justify-center gap-[10px] rounded-[8px] border border-Subbrown-3 bg-Subbrown-4 h-[36px] w-[67px] md:h-[52px] md:w-[98px] xl:w-[132px]`;
  const checkButtonTextClass = `text-primary-3 text-[12px] font-semibold leading-[145%] tracking-[-0.012px] md:body_1_3`;

  return (
    <div
      className="flex flex-col items-start gap-[24px] pb-[114px]
      w-full md:w-[480px] xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        {/* 모바일: 뒤로가기 헤더 */}
        <MobileSettingHeader title="뒤로가기" />

        {/* 타이틀 영역 */}
        <div className="w-full xl:w-[1000px]">
          <SettingsTitle title="프로필 편집" />
        </div>
      </div>

      {/* 2. 폼 본문 영역 */}
      <div
        className="flex flex-col items-center gap-[20px] px-[20px]
        w-full md:w-[480px] md:gap-[64px]
        xl:w-[688px]"
      >
        <div className="flex flex-col items-end self-stretch gap-[20px] md:gap-[40px]">
          <ProfileImageSection />

          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">
              닉네임
            </label>
            <div className="flex items-center gap-[8px] self-stretch">
              <div className={`${inputContainerClass} flex-1`}>
                <input
                  className={inputClass}
                  placeholder="변경할 닉네임을 입력해주세요"
                />
              </div>
              <button className={checkButtonClass}>
                <span className={checkButtonTextClass}>중복확인</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">소개</label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input
                className={inputClass}
                placeholder="20자 이내로 작성해주세요"
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">이름</label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input className={inputClass} placeholder="이름을 입력해주세요" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">
              전화번호
            </label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input className={inputClass} placeholder="010-0000-0000" />
            </div>
          </div>

          <CategorySelector />

          <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]">
            <span className="text-[14px] font-semibold leading-[145%] tracking-[-0.014px] text-White">
              <span className="md:hidden">변경하기</span>
              <span className="hidden md:inline">저장하기</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
