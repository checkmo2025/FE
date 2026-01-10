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

  // 모달
  const router = useRouter();
  const [applyClubId, setApplyClubId] = useState<number | null>(null);

  const onClickVisit = (clubId: number) => {
    router.push(`/clubs/${clubId}`); // 네 라우팅에 맞게 바꿔
  };

  const onClickApply = (clubId: number) => {
    setApplyClubId(clubId); // 모달 오픈
  };
  const onCloseApply = () => setApplyClubId(null);

  const onSubmitApply = async (reason: string) => {
    if (applyClubId == null) return;

    // TODO: 여기서 API 호출

    console.log('apply:', applyClubId, reason);
    setApplyClubId(null);
  };


  return (
    <div className= 'max-w-[1440px] flex flex-col gap-6 lg:flex-row mt-3 sm:mt-5 lg:mt-6 mx-auto px-6 '>
      
      <aside className="lg:w-[332px]">
        <p className='body_1 sm:subhead_2'>독서 모임</p>
        {/* 모바일 */}
        <div className="flex w-full sm:hidden mt-3 mb-2">
          <ButtonWithoutImg
            text="+ 모임 생성하기"
            height={36}
            bgColorVar="--primary_1"
            borderColorVar="--primary_1"
            textColorVar="--White"
            className=" flex-1 subhead_4_1"
          />                
        </div>

        {/* sm 이상 */}
        <div className="hidden w-full sm:flex mt-5 mb-4">
          
           <ButtonWithoutImg
            text="+ 모임 생성하기"
            height={56}
            bgColorVar="--primary_1"
            borderColorVar="--primary_1"
            textColorVar="--White"
            className="flex-1 subhead_4_1"
          />
                    
        </div>

        <Mybookclub groups={mydummyGroup} />
      </aside>

      <main className = "w-full max-w-[1040px]" >
        <div>
          <p className='body_1 sm:subhead_2'>모임 검색하기</p>  
          <div className='mt-4 lg:mt-5 mb-4 lg:mb-5'>
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

        <div className="w-full ">
            <div className="flex flex-col gap-4">
              {dummyClubs.map((club) => (
                <SearchClubListItem
                  key={club.clubId}
                  club={club}
                  onClickVisit={onClickVisit}
                  onClickApply={onClickApply}
                />
              ))}
            </div>
        </div>
      
      </main>

      <SearchClubApplyModal
        open={applyClubId !== null}
        club={dummyClubs.find((c) => c.clubId === applyClubId) ?? null}
        onClose={onCloseApply}
        onSubmit={onSubmitApply}
      />
    </div>
     
    
  )
}
