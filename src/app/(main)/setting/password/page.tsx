// src/app/(main)/settings/password/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";

export default function PasswordChangePage() {
  // 버튼 스타일 반응형 분기
  const buttonStyle = `
    flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px]
    w-[120px] md:w-[200px]
  `;
  const buttonTextStyle = "body_1_1 text-Gray-3";

  return (
    // 전체 컨테이너
    <div
      className="flex flex-col items-start gap-[24px] pb-[314px]
      w-full md:w-[480px]
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        {/* 모바일: 뒤로가기 헤더 */}
        <MobileSettingHeader title="뒤로가기" />

        {/* 타이틀: 모바일/PC 모두 노출 (반응형은 내부 처리됨) */}
        <SettingsTitle title="비밀번호 변경" />
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
              label="기존 비밀번호"
              placeholder="기존 비밀번호를 입력해주세요"
              type="password"
            />

            <div className="flex flex-col items-start gap-[8px] self-stretch w-full">
              <SettingsInputGroup
                label="새 비밀번호"
                placeholder="새 비밀번호를 입력해주세요"
                type="password"
              />
              <div className="flex h-[52px] w-full items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]">
                <input
                  type="password"
                  className="w-full bg-transparent outline-none body_1_3 text-Gray-7 placeholder:text-Gray-3"
                  placeholder="비밀번호 확인"
                />
              </div>
            </div>
          </div>

          <button className={buttonStyle}>
            <span className={buttonTextStyle}>변경하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
