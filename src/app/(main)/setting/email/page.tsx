// src/app/(main)/settings/email/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";

export default function EmailChangePage() {
  // 공통 버튼 스타일
  const buttonStyle =
    "flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px]";
  const buttonTextStyle = "body_1_1 text-Gray-3"; // semibold

  return (
    <div
      className="flex flex-col items-start gap-[24px] pb-[314px]
      w-full md:w-[480px] md:px-0
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 타이틀 영역 (반응형 적용됨) */}
      <SettingsTitle title="이메일 변경" />

      {/* 2. 폼 본문 영역 */}
      <div
        className="flex flex-col items-start gap-[40px] px-[20px]
        w-full md:w-[480px] 
        xl:w-[688px]"
      >
        {/* 섹션 1: 이메일 입력 */}
        <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
          <div className="flex flex-col items-start gap-[20px] self-stretch w-full">
            <SettingsInputGroup
              label="기존 이메일"
              placeholder="기존 이메일을 입력해주세요"
            />
            <SettingsInputGroup
              label="변경 이메일"
              placeholder="변경할 이메일을 입력해주세요"
            />
          </div>

          <button className={buttonStyle}>
            <span className={buttonTextStyle}>인증번호 발송</span>
          </button>
        </div>

        {/* 섹션 2: 인증번호 확인 */}
        <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
          <SettingsInputGroup label="인증번호" placeholder="인증번호 입력" />

          <button className={buttonStyle}>
            <span className={buttonTextStyle}>변경하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
