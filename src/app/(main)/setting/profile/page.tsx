import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";

export default function ProfileEditPage() {
  // 인풋 컨테이너 공통 스타일
  const inputContainerClass =
    "flex h-[52px] items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]";
  const inputClass =
    "w-full bg-transparent body_1_3 text-Gray-7 outline-none placeholder:text-Gray-3";

  return (
    // 전체 컨테이너
    // 태블릿: w-[480px] (패딩 없음 or 상위에서 제어)
    // 데스크탑: w-[1152px], pl-[68px], pr-[400px]
    <div
      className="flex flex-col items-start gap-[24px] pb-[114px]
      w-full md:w-[480px] md:px-0
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 타이틀 영역 */}
      {/* SettingsTitle 내부는 w-[1000px] 고정이므로, 여기서는 max-width로 제어하거나 컴포넌트 내부 수정 필요.
          현재 명세상 태블릿 타이틀 너비는 480px입니다. SettingsTitle을 수정하거나 아래처럼 직접 짭니다. */}
      <div
        className="flex items-center gap-[8px] border-b-2 border-Subbrown-4 px-[20px] py-[28px]
        w-full md:w-[480px] xl:w-[1000px]"
      >
        <h2 className="text-center subhead_3 text-Gray-6">프로필 편집</h2>
      </div>

      {/* 폼 본문 영역 */}
      {/* 태블릿: w-[480px], px-[20px] */}
      {/* 데스크탑: w-[688px], px-[20px] */}
      <div
        className="flex flex-col items-center gap-[64px] px-[20px]
        w-full md:w-[480px]
        xl:w-[688px]"
      >
        <div className="flex flex-col items-end gap-[40px] self-stretch">
          {/* 1. 이미지 업로드 섹션 */}
          <ProfileImageSection />

          {/* 2. 닉네임 입력 (중복확인 포함) */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">
              닉네임
            </label>
            <div className="flex items-center gap-[8px] self-stretch">
              {/* 인풋: 태블릿 334px / 데스크탑 508px */}
              <div
                className={`${inputContainerClass} 
                md:w-[334px] xl:w-[508px]`}
              >
                <input
                  className={inputClass}
                  placeholder="닉네임을 입력해주세요"
                />
              </div>
              {/* 버튼: 태블릿 98px / 데스크탑 132px */}
              <button
                className="flex h-[52px] items-center justify-center gap-[10px] rounded-[8px] border border-Subbrown-3 bg-Subbrown-4
                md:w-[98px] xl:w-[132px]"
              >
                <span className="body_1_3 text-primary-3">중복확인</span>
              </button>
            </div>
          </div>

          {/* 3. 소개 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">소개</label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input
                className={inputClass}
                placeholder="20자 이내로 작성해주세요"
              />
            </div>
          </div>

          {/* 4. 이름 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">이름</label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input className={inputClass} placeholder="이름을 입력해주세요" />
            </div>
          </div>

          {/* 5. 전화번호 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className="self-stretch body_1_2 text-primary-3">
              전화번호
            </label>
            <div className={`${inputContainerClass} self-stretch`}>
              <input className={inputClass} placeholder="010-0000-0000" />
            </div>
          </div>

          {/* 6. 관심 카테고리 */}
          <CategorySelector />

          {/* 7. 저장 버튼 */}
          <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px]">
            <span className="body_1 text-White">저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
