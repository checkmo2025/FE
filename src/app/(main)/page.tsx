"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import HomeNewsSection from "@/components/base-ui/home/News/HomeNewsSection";
import HomeClubSection from "@/components/base-ui/home/Club/HomeClubSection";
import HomeRecommendationSection from "@/components/base-ui/home/Recommendation/HomeRecommendationSection";
import HomeStoryList from "@/components/base-ui/home/Story/HomeStoryList";

import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useInView } from "react-intersection-observer";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useHomeInteractions } from "@/hooks/useHomeInteractions";

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();

  const {
    data: storiesData,
    isLoading: isLoadingStories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isErrorStories,
  } = useInfiniteStoriesQuery();
  const { data: membersData, isLoading: isLoadingMembers, isError: isErrorMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery(isLoggedIn);
  const { handleToggleLike, handleToggleFollow } = useHomeInteractions();

  const groups = myClubsData?.clubList || [];
  const stories = storiesData?.pages.flatMap((page) => page.basicInfoList) || [];
  const recommendedUsers = membersData?.friends || [];
  const isLoading = isLoadingStories || (isLoggedIn && isLoadingMembers) || (isLoggedIn && isLoadingClubs);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 t:px-6">
      {isLoginModalOpen && <LoginModal onClose={() => closeLoginModal()} />}

      {/* 모바일 */}
      <div className="flex flex-col gap-6 t:hidden">
        <HomeNewsSection deviceType="mobile" />

        <section className="w-full">
          <div className="flex gap-4">
            <HomeClubSection deviceType="mobile" groups={groups} />
            <HomeRecommendationSection
              deviceType="mobile"
              users={recommendedUsers}
              isError={isErrorMembers}
              onSubscribeClick={handleToggleFollow}
            />
          </div>
        </section>


        <HomeStoryList
          deviceType="mobile"
          stories={stories}
          isError={isErrorStories}
          handleToggleLike={handleToggleLike}
          handleToggleFollow={handleToggleFollow}
        />
      </div>

      {/* 태블릿 */}
      <div className="hidden t:flex flex-col gap-6 d:hidden">
        <HomeNewsSection deviceType="tablet" />

        <section className="w-full pt-6">
          <div className="flex gap-6 justify-center">
            <div className="flex flex-col">
              <HomeClubSection deviceType="tablet" groups={groups} />
            </div>
            <HomeRecommendationSection
              deviceType="tablet"
              users={recommendedUsers}
              isError={isErrorMembers}
              onSubscribeClick={handleToggleFollow}
            />
          </div>
        </section>


        <HomeStoryList
          deviceType="tablet"
          stories={stories}
          isError={isErrorStories}
          handleToggleLike={handleToggleLike}
          handleToggleFollow={handleToggleFollow}
        />
      </div>

      {/* 데스크톱 */}
      <div className="hidden d:flex flex-col gap-6 w-full">
        <div className="flex flex-row gap-6 w-full pt-6">
          <HomeClubSection deviceType="desktop" groups={groups} />
          <HomeNewsSection deviceType="desktop" />
        </div>


        <HomeStoryList
          deviceType="desktop"
          stories={stories}
          isError={isErrorStories}
          handleToggleLike={handleToggleLike}
          handleToggleFollow={handleToggleFollow}
          recommendedUsers={recommendedUsers}
          isErrorMembers={isErrorMembers}
        />
      </div>

      {!isErrorStories && hasNextPage && (
        <div ref={ref} className="w-full flex justify-center py-10">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      )}

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
