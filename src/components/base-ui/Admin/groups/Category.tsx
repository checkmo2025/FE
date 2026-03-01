"use client";

import Chip from "./Chips";

type Props = {
  title?: string;
  items: string[];
};

export default function Category({
  title = "선호하는 독서 카테고리",
  items,
}: Props) {
  return (
    <section className="w-full">
      <h2 className="text-[18px] subhead_2 text-Gray-7 mb-[10px]">{title}</h2>

      <div className="flex flex-wrap gap-x-[28px] gap-y-[12px]">
        {items.map((label, idx) => (
          <Chip
            key={`${label}-${idx}`}
            label={label}
            selected={false}
            onClick={() => {}}
          />
        ))}
      </div>
    </section>
  );
}