// src/components/base-ui/Settings/SettingsInputGroup.tsx
type Props = {
  label: string;
  placeholder: string;
  type?: "text" | "password";
};

export default function SettingsInputGroup({
  label,
  placeholder,
  type = "text",
}: Props) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px] self-stretch">
      {/* 라벨: body_1_2, Primary_3 */}
      <label className="self-stretch body_1_2 text-primary-3">{label}</label>

      {/* 인풋 컨테이너: h 52px, border Subbrown_4 */}
      <div className="flex h-[52px] w-full items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]">
        <input
          type={type}
          className="w-full bg-transparent outline-none body_1_3 text-Gray-7 placeholder:text-Gray-3"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
