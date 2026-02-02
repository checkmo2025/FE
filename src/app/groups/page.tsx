'use client'
import React, { useState } from 'react' 
import { useRouter } from 'next/navigation';


import ButtonWithoutImg from '@/components/base-ui/button_without_img';
import SearchGroupSearch from '@/components/base-ui/Group-Search/search_groupsearch';
import Mybookclub from '@/components/base-ui/Group-Search/search_mybookclub'

import { mydummyGroup, dummyClubs} from './groupSearchDummy';
import { ApplyType, Category, ParticipantType } from '@/types/groups/groups';
import SearchClubListItem from '@/components/base-ui/Group-Search/search_clublist/search_clublist_item';
import SearchClubApplyModal from '@/components/base-ui/Group-Search/search_club_apply_modal';





export interface ClubSummary {
  reason(clubId: number, reason: string): void;
  clubId: number;
  name: string;
  profileImageUrl?: string | null; // 없으면 기본 이미지 쓰면 됨
  category: number[]; // 복수 가능
  public: boolean;
  applytype: ApplyType;
  region: string;
  participantTypes: ParticipantType[];
}

export default function Searchpage() {
  // 검색창 요소들
  const [q, setQ] = useState('');
  const [category,setCategory] = useState<Category>('전체');
  const [group, setGroup] = useState<boolean>(false);
  const [region, setRegion] = useState<boolean>(false);

  const [applyClubId, setApplyClubId] = useState<number | null>(null);
  const selectedClub = dummyClubs.find((c) => c.clubId === applyClubId) ?? null;
  // 모달
  const router = useRouter();
  

  const onClickVisit = (clubId: number) => {
    router.push(`/groups/${clubId}`);
  };

  const onClickApply = (clubId: number) => {
    setApplyClubId((prev) => (prev === clubId ? null : clubId));
  };
  const onCloseApply = () => setApplyClubId(null);

  const onSubmitApply = (clubId: number, reason: string) => {
    if (!reason.trim()) return;

    console.log('apply:', clubId, reason);
    // TODO API
    setApplyClubId(null);
  };

  return (
    <div className= 'max-w-[1440px] flex flex-col gap-6 d:flex-row mt-3 sm:mt-5 d:mt-6 mx-auto px-6'>
      
      <aside className="d:w-[332px]">
        <p className='body_1 t:subhead_2'>독서 모임</p>
        {/* 모바일 */}
        <div className="flex w-full t:hidden mt-5 mb-2">
          <ButtonWithoutImg
            text="+ 모임 생성하기"
            height={36}
            bgColorVar="--Primary_1"
            borderColorVar="--Primary_1"
            textColorVar="--White"
            className=" flex-1 body_1"
            onClick={() => router.push('/groups/create')}
          />                
        </div>

        {/* 테블릿 이상 */}
        <div className="hidden w-full t:flex mt-5 mb-4">
           <ButtonWithoutImg
            text="+ 모임 생성하기"
            height={56}
            bgColorVar="--Primary_1"
            borderColorVar="--Primary_1"
            textColorVar="--White"
            className="flex-1 subhead_4_1"
            onClick={() => router.push('/groups/create')}
          />
                    
        </div>

        <Mybookclub groups={mydummyGroup} />
      </aside>

      <main className = "w-full max-w-[1440px]" >
        <div>
          <p className='body_1 t:subhead_2'>모임 검색하기</p>  
          <div className='mt-4 d:mt-5 mb-5'>
            <SearchGroupSearch
              value={q}
              onChange={setQ}
              onSubmit={() => console.log(q, category, group, region)}
              category={category}
              setCategory={setCategory}
              group={group}
              setGroup={setGroup}
              region={region}
              setRegion={setRegion}
            />
          </div>
        </div>

        <div className="w-full">
            <div className="flex flex-col gap-4">
              {dummyClubs.map((club) => (
                <SearchClubListItem
                  key={club.clubId}
                  club={club}
                  onClickVisit={onClickVisit}
                  onClickApply={onClickApply}
                  applyOpenId={applyClubId}
                  onCloseApply={onCloseApply}
                  onSubmitApply={onSubmitApply}
                />
              ))}
            </div>
        </div>
      
      </main>

      {/* 태블릿 이상: 기존 모달 */}
    <div className="hidden t:block">
      <SearchClubApplyModal
        open={applyClubId !== null}
        club={selectedClub}
        onClose={onCloseApply}
        onSubmit={onSubmitApply}
      />
    </div>

    </div>
     
    
  )
}
