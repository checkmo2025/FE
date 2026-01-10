'use client';

import Image from 'next/image';
import React from 'react';
import ClubCategoryTags from './search_club_category_tags';
import { ClubSummary } from '@/app/groups/page';


const DEFAULT_CLUB_IMG = '/ClubDefaultImg.svg';

// participantTypes 한글 매핑
const PARTICIPANT_KO: Record<string, string> = {
  STUDENT: '대학생',
  WORKER: '직장인',
  ONLINE: '온라인',
  CLUB: '동아리',
  MEETING: '모임',
  OFFLINE: '대면',
};

const APPLY_META: Record<
  ClubSummary['applytype'],
  { label?: string; icon?: string; labelClass?: string }
> = {
  No: {},
  Wait: { label: '신청 완료', icon: '/GreenCheck.svg', labelClass: 'text-green-600' },
  Yes: { label: '가입 됨', icon: '/BrownCheck.svg', labelClass: 'text-primary-3' },
};

type Props = {
  club: ClubSummary;
  onClickVisit?: (clubId: number) => void;
  onClickApply?: (clubId: number) => void;
};

export default function SearchClubListItem({
  club,
  onClickVisit,
  onClickApply,
}: Props) {
  const imgSrc = club.profileImageUrl ?? DEFAULT_CLUB_IMG;

  const participantText = club.participantTypes
    .map((t) => PARTICIPANT_KO[t] ?? t)
    .join(', ');

  const applyMeta = APPLY_META[club.applytype];

  return (
    <div
      className={[
        'flex w-full max-w-[1040px] h-[180px] p-4',
        'justify-between items-center',
        'rounded-[8px] border-2 border-Subbrown-4 bg-White',
      ].join(' ')}
    > 
      {/* Left */}

      {/* 테블릿 이상 */}
      <div className="hidden sm:flex items-center gap-6 min-w-0">
        <Image
          src={imgSrc}
          alt="모임 이미지"
          width={148}
          height={148}
          className="shrink-0 rounded-[8px] object-cover"
        />
        <div>
            {/*이름, 태그*/}
          <div className="min-w-0">
            
            <p className="subhead_2 text-Gray-7 truncate">{club.name}</p>
            {/* category tags */}
            <div className="mt-2">
              <ClubCategoryTags category={club.category} />
            </div>
          </div>
          {/*모임 대상 , 지역*/}
          <div className="mt-3 flex flex-col gap-1">
              <p className="Body_1_2 text-Gray-4">
                모임 대상 :{' '}
                <span className="text-Gray-7">{participantText || '-'}</span>
              </p>
              <p className="Body_1_2 text-Gray-4">
                활동 지역 : <span className="text-Gray-7">{club.region}</span>
              </p>
          </div>
        </div>
        
      </div>

      {/* 모바일 */}
      <div className="sm:hidden items-center gap-6 min-w-0">
        {/*이름, 태그*/}
        <div className="min-w-0">
            <p className="body_1 text-Gray-7 truncate">{club.name}</p>
            {/* category tags */}
            <div className="mt-1">
              <ClubCategoryTags category={club.category} className='body_2_2' />
            </div>
        </div>

          <div className="mt-3 flex items-start gap-4">
            {/* 1) 이미지 */}
            <Image
              src={imgSrc}
              alt="모임 이미지"
              width={72}
              height={72}
              className="shrink-0 rounded-[8px] object-cover"
            />

            {/* 3) 모임 대상, 지역 */}
            <div className="flex flex-col gap-1 min-w-0">
              <p className="body_2_2 text-Gray-4">
                모임 대상 : <span className="text-Gray-7">{participantText || '-'}</span>
              </p>
              <p className="body_2_2 text-Gray-4">
                활동 지역 : <span className="text-Gray-7">{club.region}</span>
              </p>
            </div>
          </div>
        
      </div>

      {/* RIGHT: 상태/버튼 */}
      <div className="flex flex-col justify-between h-full items-end">
        {/* 오른쪽 상단: 공개/비공개 + applytype 상태 */}
        <div className="flex flex-col items-end">
          {/* 공개/비공개 */}
          <div className="flex items-center gap-1">
            <span className="body_2_2 lg:body_1_2 text-Gray-4">
              {club.public ? '공개' : '비공개'}
            </span>
            <Image
              src={club.public ? '/Unlock.svg' : '/lock.svg'}
              alt=""
              width={16}
              height={16}
            />
          </div>

          {applyMeta.label && (
            <div className="flex items-center gap-1">
              <span className={['body_2_2 lg:body_1_2', applyMeta.labelClass ?? 'text-Gray-4'].join(' ')}>
                {applyMeta.label}
              </span>
              {applyMeta.icon && (
                <Image src={applyMeta.icon} alt="" width={16} height={16} />
              )}
            </div>
          )}
        </div>
        
        {/* 오른쪽 하단: 버튼 */}
        <div className="w-[100px] sm:w-[132px]">
          {club.applytype === 'No' && (
            <button
              type="button"
              onClick={() => onClickApply?.(club.clubId)}
              className={[
                'flex-1',
                'h-[28px] sm:h-[40px] px-4 py-2 w-full',
                'flex items-center justify-center gap-[10px]',
                'rounded-[8px]',
                'bg-primary-2 text-White',
                'body_1_2',
                'mb-1'
              ].join(' ')}
            >
              가입하기
            </button>
          )}

          <button
            type="button"
            onClick={() => onClickVisit?.(club.clubId)}
            className={[
              'flex-1',
              'h-[28px] sm:h-[40px] px-4 py-2 w-full',
              'flex items-center justify-center gap-[10px]',
              'rounded-[8px]',
              'border border-primary-1',
              'bg-background text-primary-3',
              'body_1_2',
            ].join(' ')}
          >
            방문하기
          </button>
        </div>

      </div>
    </div>
  );
}
