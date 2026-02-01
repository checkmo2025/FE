import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export default function PasswordChangePage() {
  const buttonStyle =
    "flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px] w-[120px] md:w-[200px]";
  const buttonTextStyle = "body_1_1 text-Gray-3";
  const inputContainerClass =
    "flex h-[52px] w-full items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]";

  return (
    <SettingsDetailLayout title="비밀번호 변경" className="gap-[40px]">
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
            {/* 비밀번호 확인 인풋 */}
            <div className={inputContainerClass}>
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
    </SettingsDetailLayout>
  );
}
