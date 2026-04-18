"use client";

import { useRouter } from "next/navigation";

import HomeNewsSection from "@/components/base-ui/home/News/HomeNewsSection";
import HomeClubSection from "@/components/base-ui/home/Club/HomeClubSection";
import HomeRecommendationSection from "@/components/base-ui/home/Recommendation/HomeRecommendationSection";
import HomeStoryList from "@/components/base-ui/home/Story/HomeStoryList";

import { useAuthStore } from "@/store/useAuthStore";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useHomeInteractions } from "@/hooks/useHomeInteractions";


export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { handleToggleFollow } = useHomeInteractions();

  const { data: membersData, isLoading: isLoadingMembers, isError: isErrorMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery(isLoggedIn);


  const groups = myClubsData?.clubList || [];
  const recommendedUsers = membersData?.friends || [];



  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 t:px-6">

      <div className="flex flex-col gap-6 w-full">
        {/* 상단 영역: 뉴스, 독서모임, 추천 (기기별 배치 자동 조정) */}
        <div className="flex flex-col d:flex-row gap-6 w-full pt-0 d:pt-6">
          
          {/* 뉴스 섹션 */}
          <div className="order-1 d:order-2 d:flex-1">
            <HomeNewsSection isLoading={false} />
          </div>


          {/* 독서모임 & 추천 섹션 그룹 */}
          <div className="order-2 d:order-1 flex flex-row gap-4 t:gap-6 d:gap-0 justify-center d:justify-start d:w-full d:max-w-[332px]">
            <HomeClubSection 
              groups={groups} 
              isLoading={isLoadingClubs} 
            />
            
            <div className="flex-1 t:flex-none d:hidden">
              <HomeRecommendationSection
                users={recommendedUsers}
                isError={isErrorMembers}
                isLoading={isLoadingMembers}
                onProfileClick={(nickname) => router.push(`/profile/${nickname}`)}
                onSubscribeClick={handleToggleFollow}
              />
            </div>
          </div>
        </div>

        {/* 스토리 리스트: 최적화된 단일 렌더링 리스트 */}
        <section className="pt-6">
          <HomeStoryList
            recommendedUsers={recommendedUsers}
            isErrorMembers={isErrorMembers}
            isLoadingMembers={isLoadingMembers}
            onToggleFollow={handleToggleFollow}
          />
        </section>

      </div>

      {!isLoggedIn && (
        <button
          onClick={() => openLoginModal()}
          className="fixed bottom-21 right-4 t:bottom-8 t:right-8 z-[60] flex items-center justify-center w-auto h-[48px] px-6 bg-[#7B6154] text-white rounded-full shadow-lg hover:bg-[#5E4A40] transition-colors gap-2"
        >
          <span className="font-semibold">로그인 하기</span>
        </button>
      )}
    </div>
  );
}
