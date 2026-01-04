"use client";

import { useState } from "react";
import Image from "next/image";

export type GroupSummary = { id: string; name: string };

type Props = {
  groups: GroupSummary[];
};

export default function HomeBookclub({ groups }: Props) {
  const count = groups.length;
  const isMany = count >= 5;

  const [open, setOpen] = useState(false);

  // 접힘: 6개만 / 펼침: 전체
  const displayGroups = isMany && !open ? groups.slice(0, 6) : groups;

  return (
    <aside
      className={[
        "flex flex-col w-[332px] p-5 rounded-[8px] bg-Subbrown-4",
        "overflow-hidden transition-[height] duration-200",
        open ? "h-[814px]" : "h-[424px]",
      ].join(" ")}
    >
      {/* 0개 */}
      {count === 0 && (
        <div className="">
          <img src="logo2.svg" alt="로고" className="mx-auto mb-4 mt-[118px]" />
        </div>
      )}

      {/* 리스트 */}
      {count > 0 && (
        <div
          className={[
            "flex flex-col gap-2",
            open ? "flex-1 overflow-y-auto pr-1" : "",
          ].join(" ")}
        >
          {displayGroups.map((group) => (
            <div
              key={group.id}
              className="flex w-[288px] h-[52px] py-3 px-4 items-center rounded-lg bg-white"
            >
              <span className="text-Gray-7 h-6 Subhead_4_1">
                {group.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 하단 */}
      <div className="mt-auto pt-3">
        {isMany ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full h-[38px] rounded-[6px] bg-transparent text-[13px] flex items-center justify-center gap-[6px] text-Gray-3"
          >
            {open ? (
              <div className="flex items-center justify-center gap-1">
                <span className="text-Gray-7 Body_1_2">
                  접기
                </span>
                <Image src="/ArrowTop.svg" alt="" width={24} height={24} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span className="text-Gray-7 Body_1_2">
                  전체보기
                </span>
                <Image src="/ArrowDown.svg" alt="" width={24} height={24} />
              </div>
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full h-[48px] py-3 rounded-[8px] bg-white border border-[#E6E6E6]
                        text-[13px] flex items-center justify-center gap-2"
            >
              <Image
                src="/search.svg"
                alt="모임 검색하기"
                width={24}
                height={24}
              />
              <span className="text-primary-3 Subhead_4_1">
                모임 검색하기
              </span>
            </button>

            <button
              type="button"
              className="w-full h-[48px] py-3 rounded-[6px] bg-[#6B5448] text-white
                        text-[13px] flex items-center justify-center gap-2"
            >
              <Image
                src="/icon_plus.svg"
                alt="icon_plus"
                width={24}
                height={24}
              />
              <span className="text-color-white Subhead_4_1">
                모임 생성하기
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
