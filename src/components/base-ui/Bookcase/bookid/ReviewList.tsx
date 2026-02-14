'use client';

import Image from 'next/image';
import { StarRating } from './StarRating';


export type ReviewItem = {
  id: number | string;
  name: string;
  content: string;
  rating: number; // 0~5 (0.5 가능)
  profileImageUrl?: string | null;
};

type Props = {
  items: ReviewItem[];
  onClickMore?: (id: ReviewItem['id']) => void;
};

const DEFAULT_PROFILE = '/profile4.svg';

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
            {/* 상단: (모바일) 프로필+이름 / 별점 / 더보기
                (t~) 프로필+이름 / 별점 / 내용 / 더보기 */}
            <div
              className="
                grid items-center gap-x-3
                grid-cols-[auto_auto_1fr_auto]
              "
            >
              <div className="
                grid items-center gap-x-1
                grid-cols-[auto_auto_1fr_auto]
              ">
                {/* 프로필 + 이름 */}
              <div className="flex items-center gap-3 min-w-0 t:min-w-[120px] d:min-w-[170px]">
                <Image
                  src={profileSrc}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
                />
                <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate max-w-[72px] t:max-w-[96px] d:max-w-[120px]">
                  {item.name}
                </p>
              </div>

              {/* 별점:*/}
              <StarRating
                value={item.rating}
                className="justify-self-start w-fit"
                starClassName="w-[16px] h-[16px] t:w-[18px] t:h-[18px] d:w-[20px] d:h-[20px]"
              />
              </div>

              {/* 내용: t 이상에서만 같은 줄 */}
              <p
                className="
                  hidden t:block
                  min-w-0
                  text-Gray-6
                  body_2_3 d:body_1_2
                  [font-feature-settings:'case'_on]
                  break-words
                "
              >
                {item.content}
              </p>

              {/* 더보기 */}
              <button
                type="button"
                onClick={() => onClickMore?.(item.id)}
                className="relative w-6 h-6 shrink-0 justify-self-end t:col-start-4"
                aria-label="더보기"
              >
                <Image src="/ant-design_more-outlined.svg" alt="" fill className="object-contain" />
              </button>
            </div>

            {/* 모바일: 내용은 아래로 */}
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
