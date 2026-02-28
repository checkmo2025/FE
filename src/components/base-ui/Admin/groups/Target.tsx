"use client";

import Chip from "./Chips";

type Props = {
  title?: string;
  items: string[];
};

export default function TargetSection({
  title = "모임 대상",
  items,
}: Props) {
  return (
    <section className="w-full">
      <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">{title}</h2>

      <div className="flex flex-wrap gap-x-[28px] gap-y-[12px]">
        {items.map((label, idx) => (
          <Chip
            key={`${label}-${idx}`}
            label={label}
            selected={false} // 지금은 UI만
            onClick={() => {}} // 기능 없음
          />
        ))}
      </div>
    </section>
  );
}