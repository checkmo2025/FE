type Props = {
  title: string;
};

export default function SettingsTitle({ title }: Props) {
  return (
    <div
      className={`
      flex items-center gap-[8px] px-[20px] py-[28px]
      w-full md:w-[480px] xl:w-[1000px]
      
      border-b border-Subbrown-4 md:border-b-2
    `}
    >
      <h2 className="text-center subhead_3 text-Gray-6">{title}</h2>
    </div>
  );
}
