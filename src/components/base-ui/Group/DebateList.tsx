"use client";

import Image from "next/image";

export type DebateItem = {
  id: number | string;
  name: string;
  content: string;
  profileImageUrl?: string | null;
};

type Props = {
  items: DebateItem[];
  onClickMore?: (id: DebateItem["id"]) => void; // 햄버거(⋮) 눌렀을 때
};

const DEFAULT_PROFILE = "/profile4.svg";

export default function DebateList({ items, onClickMore }: Props) {
  return (
    <div className="w-full flex flex-col gap-[6px]">
      {items.map((item) => {
        const profileSrc = item.profileImageUrl || DEFAULT_PROFILE;

        return (
          <div
            key={item.id}
            className="
              w-full
              flex flex-col
              rounded-[8px]
              border border-Subbrown-4
              bg-White
              px-5 py-3
            "
          >
            {/* 모바일: grid로 2줄 구성 (위: 프로필+이름+메뉴 / 아래: 내용)
                t 이상: flex 한 줄 */}
            <div
              className="
                grid grid-cols-[auto_1fr_auto] items-center
                t:flex t:items-center t:gap-3
              "
            >
              {/* 프로필 + 이름: '한 덩어리' */}
            <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
              <Image
                src={profileSrc}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
              />
              <p className="text-Gray-7 body_1_2 d:subhead_4_1  truncate">
                {item.name}
              </p>
            </div>

              {/* t 이상에서만 내용이 같은 줄로 옴 */}
              <p
                className="
                  hidden t:block
                  min-w-0 flex-1
                  text-Gray-6
                  body_2_3 d:body_1_2
                  [font-feature-settings:'case'_on]
                  break-words
                "
              >
                {item.content}
              </p>

              {/* 햄버거 아이콘 (24x24) */}
              <button
                type="button"
                onClick={() => onClickMore?.(item.id)}
                className="relative w-6 h-6 shrink-0 justify-self-end"
                aria-label="더보기"
              >
                <Image src="/ant-design_more-outlined.svg" alt="" fill className="object-contain" />
              </button>
            </div>

            {/* 모바일에서만: 내용이 아래로 내려감 (name 아래 라인) */}
            <p
              className="
                mt-2
                t:hidden
                text-Gray-6
                body_2_3
                [font-feature-settings:'case'_on]
                break-words
              "
            >
              {item.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
