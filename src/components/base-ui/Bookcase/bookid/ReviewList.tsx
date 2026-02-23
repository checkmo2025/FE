"use client";

import Image from "next/image";
import { StarRating } from "./StarRating";

export type ReviewItem = {
  id: number | string;
  name: string;
  content: string;
  rating: number;
  profileImageUrl?: string | null;
};

type Props = {
  items: ReviewItem[];
  onClickMore?: (id: ReviewItem["id"]) => void;
};

const DEFAULT_PROFILE = "/profile4.svg";

export default function ReviewList({ items, onClickMore }: Props) {
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
              {/* 왼쪽 덩어리: 프로필+이름 + 별점 + 내용 */}
              <div className="min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex gap-3 items-center hover:brightness-95 cursor-pointer ">
                    <Image
                      src={profileSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded-full object-cover w-[24px] h-[24px]"
                    />
                    <p className="text-Gray-7 items-center body_1_2 truncate min-w-0">
                      {item.name}
                    </p>
                  </div>
                  <StarRating
                    value={item.rating}
                    className="ml-1 items-center"
                    starClassName="w-[16px] h-[16px]"
                  />
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
                className="relative w-6 h-6 shrink-0 justify-self-end self-center hover:brightness-80 cursor-pointer"
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
              <div className="flex items-center gap-3 min-w-0 t:min-w-[120px] d:min-w-[170px] hover:brightness-95 cursor-pointer">
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

              {/* 별점 */}
              <StarRating
                value={item.rating}
                className="shrink-0"
                starClassName="w-[18px] h-[18px] d:w-[20px] d:h-[20px]"
              />

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
                className="relative w-6 h-6 shrink-0 hover:brightness-80 cursor-pointer"
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
