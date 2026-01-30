// src/components/base-ui/Settings/SettingsTitle.tsx
type Props = {
  title: string;
};

export default function SettingsTitle({ title }: Props) {
  return (
    // 명세: width 1000px, border-bottom 2px Subbrown_4
    <div className="flex w-[1000px] items-center gap-[8px] border-b-2 border-Subbrown-4 px-[20px] py-[28px]">
      <h2 className="text-center subhead_3 text-Gray-6">{title}</h2>
    </div>
  );
}
