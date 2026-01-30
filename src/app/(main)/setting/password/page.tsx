// src/app/(main)/settings/password/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";

export default function PasswordChangePage() {
  return (
    <div
      className="flex flex-col items-start gap-[24px] pb-[314px]
      w-full md:w-[480px] md:px-0
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 타이틀 영역*/}
      <SettingsTitle title="비밀번호 변경" />

      {/* 2. 폼 본문 영역 */}

      <div
        className="flex flex-col items-start gap-[40px] px-[20px] self-stretch
        w-full md:w-[480px]
        xl:w-[688px]"
      >
        {/* 입력 섹션: gap 24px */}
        <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
          {/* 인풋 그룹들: gap 20px */}
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
              {/* 비밀번호 확인 인풋 (라벨 없이 연속 배치) */}
              <div className="flex h-[52px] w-full items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]">
                <input
                  type="password"
                  className="w-full bg-transparent outline-none body_1_3 text-Gray-7 placeholder:text-Gray-3"
                  placeholder="비밀번호 확인"
                />
              </div>
            </div>
          </div>

          {/* 변경하기 버튼 */}
          <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px]">
            <span className="body_1_1 text-Gray-3">변경하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
