// src/components/base-ui/Settings/SettingsTitle.tsx
type Props = {
  title: string;
};

export default function SettingsTitle({ title }: Props) {
  return (
    <div
      className="flex items-center gap-[8px] border-b-2 border-Subbrown-4 px-[20px] py-[28px]
      w-full md:w-[480px] xl:w-[1000px]"
    >
      <h2 className="text-center subhead_3 text-Gray-6">{title}</h2>
    </div>
  );
}
