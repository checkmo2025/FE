import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";

export default function EmailChangePage() {
  const buttonStyle = `
    flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px]
    w-[120px] md:w-[200px]
  `;
  const buttonTextStyle = "body_1_1 text-Gray-3";

  return (
    <div
      className="flex flex-col items-start gap-[24px] pb-[314px]
      w-full md:w-[480px]
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        {/* 모바일: 뒤로가기 헤더 */}
        <MobileSettingHeader title="뒤로가기" />

        {/* 타이틀 영역 (모바일/PC 공통 노출, 반응형은 컴포넌트 내부 처리) */}
        <SettingsTitle title="이메일 변경" />
      </div>

      {/* 2. 폼 본문 영역 */}
      <div
        className="flex flex-col items-start gap-[40px] px-[20px]
        w-full md:w-[480px]
        xl:w-[688px]"
      >
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
