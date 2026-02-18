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
  onClickMore?: (id: DebateItem["id"]) => void;
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
            {/* Mobile */}
            <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 t:hidden">
              {/* 왼쪽 덩어리 (프로필+이름 + 내용) */}
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={profileSrc}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full object-cover w-[24px] h-[24px]"
                  />
                  <p className="text-Gray-7 body_1_2 truncate min-w-0">
                    {item.name}
                  </p>
                </div>

                <p
                  className="
                    mt-2
                    text-Gray-6
                    body_2_3
                    [font-feature-settings:'case'_on]
                    break-words
                  "
                >
                  {item.content}
                </p>
              </div>

              {/* 햄버거 */}
              <button
                type="button"
                onClick={() => onClickMore?.(item.id)}
                className="relative w-6 h-6 shrink-0 justify-self-end self-center"
                aria-label="더보기"
              >
                <Image
                  src="/ant-design_more-outlined.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </button>
            </div>

            {/* Tablet+ */}
            <div className="hidden t:flex t:items-center t:gap-3">
              {/* 프로필+이름 */}
              <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
                <Image
                  src={profileSrc}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full object-cover w-[28px] h-[28px] d:w-[40px] d:h-[40px]"
                />
                <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">
                  {item.name}
                </p>
              </div>

              {/* 내용 */}
              <p
                className="
                  min-w-0 flex-1
                  text-Gray-6
                  body_2_3 d:body_1_2
                  [font-feature-settings:'case'_on]
                  break-words
                "
              >
                {item.content}
              </p>

              {/* 햄버거 */}
              <button
                type="button"
                onClick={() => onClickMore?.(item.id)}
                className="relative w-6 h-6 shrink-0"
                aria-label="더보기"
              >
                <Image
                  src="/ant-design_more-outlined.svg"
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
  );
}
