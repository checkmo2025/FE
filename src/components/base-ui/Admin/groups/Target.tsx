"use client";

import Chip from "./Chips";

type TargetItem = {
  label: string;
  selected: boolean;
};

type Props = {
  title?: string;
  items: TargetItem[];
  onToggle?: (label: string) => void; // 👈 추가
};

export default function TargetSection({
  title = "모임 대상",
  items,
  onToggle,
}: Props) {
  return (
    <section className="w-full">
      <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
        {title}
      </h2>

      <div className="flex flex-wrap gap-x-[28px] gap-y-[12px]">
        {items.map((item, idx) => (
          <Chip
            key={`${item.label}-${idx}`}
            label={item.label}
            selected={item.selected}
            onClick={() => onToggle?.(item.label)}
          />
        ))}
      </div>
    </section>
  );
}