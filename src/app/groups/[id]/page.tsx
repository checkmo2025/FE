'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DUMMY_CLUB_HOME } from './dummy';
import ClubCategoryTags from '@/components/base-ui/Group-Search/search_clublist/search_club_category_tags';
import { BOOK_CATEGORIES } from '@/types/groups/groups';
import ButtonWithoutImg from '@/components/base-ui/button_without_img';

const DEFAULT_CLUB_IMG = '/ClubDefaultImg.svg';

export default function GroupDetailPage() {
  const router = useRouter();

  const noticeText = DUMMY_CLUB_HOME.recentNotice?.title ?? '공지사항이 없습니다.';
  const noticeUrl = DUMMY_CLUB_HOME.recentNotice?.url ?? '/groups';

  const imgSrc = DUMMY_CLUB_HOME.profileImageUrl ?? DEFAULT_CLUB_IMG;
  const clubName = DUMMY_CLUB_HOME.name;

  const joinUrl = DUMMY_CLUB_HOME.links?.joinUrl ?? '/groups';
  const contactUrl = DUMMY_CLUB_HOME.links?.contactUrl ?? '/contact';

  const participantText = DUMMY_CLUB_HOME.participantTypes
    .map((p) => p.description)
    .join(', ');

  // description(한글 라벨) -> 1~15 번호
  const nums = DUMMY_CLUB_HOME.category
    .map((c) => BOOK_CATEGORIES.indexOf(c.description as never) + 1)
    .filter((n) => n >= 1 && n <= 15);

  return (
    <main className="w-full">
      {/* 최대 1024, d에서만 px-10(40px) */}
      <div className="mx-auto w-full max-w-[1024px] t:px-10">
        {/* 1) 공지 (항상 최상단) */}
        <Link
          href={noticeUrl}
          className="
            block w-full
            rounded-[8px]
            border border-Subbrown-3
            bg-White
            p-4
            cursor-pointer
            hover:bg-[color:var(--background)]
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-Subbrown-2
          "
          aria-label="공지사항으로 이동"
        >
          <div className="flex items-center gap-3">
            {/* 종 박스 */}
            <div
              className="
                shrink-0
                rounded-[4px]
                bg-Secondary-2
                py-[4px] px-[8px]
                flex items-center justify-center
              "
            >
              <Image src="/Notification3.svg" alt="공지" width={16} height={16} className="object-contain" />
            </div>

            {/* 공지 텍스트 */}
            <p className="body_1_2 text-Gray-5 min-w-0 truncate">{noticeText}</p>
          </div>
        </Link>
        {/* 본문 */}
        <div className="mt-4">
        
        {/* Desktop (d): 이미지 | (텍스트 + 버튼은 같은 컬럼, 버튼은 글 하단) */}
          <div className="hidden d:flex items-stretch gap-6">
            {/* 2) 이미지 */}
            <div
              className="
                relative shrink-0 overflow-hidden
                d:w-[300px] d:h-[300px]
                rounded-[12px]
                bg-Gray-1
              "
            >
              <Image
                src={imgSrc}
                alt={`${clubName} 프로필 이미지`}
                fill
                className="object-cover"
                sizes="300px"
                priority
              />
            </div>

            {/* 3) 텍스트 + 4) 버튼 (같은 컬럼) */}
            <div className="min-w-0 flex-1 flex flex-col min-h-[300px]">
              {/* chips */}
              <div className="flex flex-wrap gap-3">
                <ClubCategoryTags category={nums} />
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">모임 대상</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 break-words">{participantText}</p>
                </div>

                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">활동 지역</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 break-words">{DUMMY_CLUB_HOME.region ?? '-'}</p>
                </div>
              </div>

              <div className="mt-[19px]">
                <p className="body_1_3 text-Gray-5">설명</p>
                <p className="body_1_3 text-Gray-5 mt-2 whitespace-pre-line break-words">
                  {DUMMY_CLUB_HOME.description ?? '설명이 없습니다.'}
                </p>
              </div>

              {/* 버튼: 글 하단 */}
              <div className="mt-auto pt-6 flex gap-3">
                <ButtonWithoutImg
                  text="이번 모임 바로가기"
                  onClick={() => router.push(joinUrl)}
                  bgColorVar="--Primary_1"
                  borderColorVar="--Primary_1"
                  textColorVar="--White"
                  className="w-[300px] h-[44px] body_1"
                />
                <ButtonWithoutImg
                  text="Contact US"
                  onClick={() => router.push(contactUrl)}
                  bgColorVar="--Subbrown_4"
                  borderColorVar="--Subbrown_2"
                  textColorVar="--Primary_3"
                  className="w-[300px] h-[44px] body_1"
                />
              </div>
            </div>
          </div>


        <div className="flex flex-col gap-6 d:hidden">

          <div className="flex flex-col gap-4 t:flex-row t:items-start t:gap-6">
            {/* 2) 이미지 */}
            <div
              className="
                relative shrink-0 overflow-hidden
                w-[110px] h-[110px]
                t:w-[300px] t:h-[300px]
                rounded-[12px]
                bg-Gray-1
              "
            >
              <Image
                src={imgSrc}
                alt={`${clubName} 프로필 이미지`}
                fill
                priority
              />
            </div>

            {/* 3) 내용 */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-3">
                <ClubCategoryTags category={nums} />
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">모임 대상</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 break-words">{participantText}</p>
                </div>

                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">활동 지역</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 break-words">{DUMMY_CLUB_HOME.region ?? '-'}</p>
                </div>
              </div>

              <div className="mt-[19px]">
                <p className="body_1_3 text-Gray-5">설명</p>
                <p className="body_1_3 text-Gray-5 mt-2 whitespace-pre-line break-words">
                  {DUMMY_CLUB_HOME.description ?? '설명이 없습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/*  버튼 태블릿/모바일 (전체 하단) */}
          <div className="w-full flex flex-col t:flex-row gap-3">
            <ButtonWithoutImg
              text="이번 모임 바로가기"
              onClick={() => router.push(joinUrl)}
              bgColorVar="--Primary_1"
              borderColorVar="--Primary_1"
              textColorVar="--White"
              className="w-full d:w-[300px] h-[44px] body_1"
            />
            <ButtonWithoutImg
              text="Contact US"
              onClick={() => router.push(contactUrl)}
              bgColorVar="--Subbrown_4"
              borderColorVar="--Subbrown_2"
              textColorVar="--Primary_3"
              className="w-full d:w-[300px] h-[44px] body_1"
            />
          </div>
        </div>
    </div>
    </div>
    </main>
  );
}
