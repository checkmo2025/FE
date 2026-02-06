"use client";

import Image from "next/image";
import React from "react";

export type TeamDebateItem = {
  id: number | string;
  name: string;
  content: string;
  profileImageUrl?: string | null; // "profile1.svg" 형태도 온다고 가정
};

type Props = {
  teamName: string;
  memberCount: number;

  items: TeamDebateItem[];
  checkedMap: Record<string, boolean>;

  onToggleCheck: (id: string) => void;
  onSortCheckedFirst: () => void;
};

const DEFAULT_PROFILE = "/profile4.svg";

const normalizeSrc = (src?: string | null) => {
  if (!src) return DEFAULT_PROFILE;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`; // "profile1.svg" -> "/profile1.svg"
};

export default function TeamDebateSection({
  teamName,
  memberCount,
  items,
  checkedMap,
  onToggleCheck,
  onSortCheckedFirst,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-[16px]">
      {/* 상단: 조 이름 / 인원 / 정렬하기 */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-Gray-7 subhead_4_1">{teamName}</span>

          <div className="flex items-center gap-1 text-Gray-5">
            <div className="relative w-4 h-4 t:w-5 t:h-5">
              <Image src="/icon_person.svg" alt="" fill className="object-contain" />
            </div>
            <span className="body_2_3">{memberCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSortCheckedFirst}
          className="flex items-center gap-2 text-Gray-5 body_2_3"
          aria-label="정렬하기"
        >
          <div className="relative w-4 h-4 t:w-5 t:h-5">
            <Image src="/icon_sort.svg" alt="" fill className="object-contain" />
          </div>
          정렬하기
        </button>
      </div>

      {/* 리스트 */}
      <div className="w-full flex flex-col gap-[10px]">
        {items.map((item) => {
          const id = String(item.id);               // ✅ 무조건 string
          const isChecked = checkedMap[id] === true; // ✅ boolean 확정

          return (
            <div
              key={id}
              className={[
                "w-full rounded-[8px] border px-5 py-3 transition-colors border-Subbrown-4",
                isChecked ? "bg-[#3BBF82]" : "bg-White border-Subbrown-4",
              ].join(" ")}
            >
              <div className="grid items-center gap-x-3 grid-cols-[auto_1fr_auto]">
                {/* 프로필 + 이름 */}
                <div className="flex items-center gap-3 min-w-0">
                  <Image
                    src={normalizeSrc(item.profileImageUrl)}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
                  />
                  <p className={`text-Gray-7 body_1_2 d:subhead_4_1 truncate`}>
                    {item.name}
                  </p>
                </div>

                {/* 내용 */}
                <p
                  className={`
                    min-w-0 break-words
                    body_2_3 d:body_1_2
                    text-Gray-7
                    [font-feature-settings:'case'_on]
                  `}
                >
                  {item.content}
                </p>

                {/* 체크 */}
                <button
                  type="button"
                  onClick={() => onToggleCheck(id)}
                  className="relative w-6 h-6 shrink-0 justify-self-end"
                  aria-label="체크 토글"
                >
                  <Image
                    src={isChecked ? "/CheckOn.svg" : "/CheckOff.svg"}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
