import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export default function EmailChangePage() {
  const buttonStyle =
    "flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px] w-[120px] md:w-[200px]";
  const buttonTextStyle = "body_1_1 text-Gray-3";

  return (
    <SettingsDetailLayout title="이메일 변경" className="gap-[40px]">
      {/* 섹션 1 */}
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

      {/* 섹션 2 */}
      <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
        <SettingsInputGroup label="인증번호" placeholder="인증번호 입력" />
        <button className={buttonStyle}>
          <span className={buttonTextStyle}>변경하기</span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}
