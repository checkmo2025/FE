"use client";

import { useRouter } from "next/navigation";
import NewsBannerSlider from "@/components/base-ui/home/Banner/NewsBannerSlider";
import HomeBookclub from "@/components/base-ui/home/Club/home_bookclub";
import HomeStoryList from "@/components/base-ui/home/Story/HomeStoryList";
import ListSubscribeLarge from "@/components/base-ui/home/Subscription/list_subscribe_large";
import ListSubscribeElement from "@/components/base-ui/home/Subscription/list_subscribe_element";
import LoginModal from "@/components/base-ui/Login/LoginModal";

import { useAuthStore } from "@/store/useAuthStore";
import { useRecommendedMembersQuery } from "@/hooks/queries/useMemberQueries";
import { useMyClubsQuery } from "@/hooks/queries/useClubQueries";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";

export default function HomePage() {
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();

  const { data: membersData, isLoading: isLoadingMembers, isError: isErrorMembers } = useRecommendedMembersQuery(isLoggedIn);
  const { data: myClubsData, isLoading: isLoadingClubs } = useMyClubsQuery(isLoggedIn);
  const { mutate: toggleFollow } = useToggleFollowMutation();

  const handleToggleFollow = (nickname: string, isFollowing: boolean) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleFollow({ nickname, isFollowing });
  };

  const groups = myClubsData?.clubList || [];
  const recommendedUsers = membersData?.friends || [];
  const isLoading = (isLoggedIn && isLoadingMembers) || (isLoggedIn && isLoadingClubs);

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
        <section className="pt-6">
          <h2 className="pb-4 body_1 leading-7 text-zinc-800">소식</h2>
          <NewsBannerSlider />
        </section>

        <section className="w-full">
          <div className="flex gap-4">
            <div className="flex-1">
              <h2 className="pb-2 body_1 leading-7 text-zinc-800">독서모임</h2>
              <HomeBookclub groups={groups} />
            </div>
            <div className="flex-1">
              <h2 className="pb-2 body_1 leading-7 text-zinc-800">사용자 추천</h2>
              <div className="flex flex-col gap-3">
                {isErrorMembers ? (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <p className="text-Gray-4 text-[14px]">추천 목록을 불러오지 못했어요.</p>
                  </div>
                ) : recommendedUsers.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <p className="text-Gray-4 text-[14px]">사용자 추천이 없습니다.</p>
                  </div>
                ) : (
                  recommendedUsers.slice(0, 3).map((u) => (
                    <ListSubscribeElement
                      key={u.nickname}
                      name={u.nickname}
                      profileSrc={u.profileImageUrl}
                      isFollowing={u.isFollowing}
                      onSubscribeClick={() => handleToggleFollow(u.nickname, u.isFollowing)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="pt-6">
          <HomeStoryList
            recommendedUsers={recommendedUsers}
            isErrorMembers={isErrorMembers}
            onToggleFollow={handleToggleFollow}
          />
        </section>
      </div>

      {/* 태블릿 */}
      <div className="hidden t:flex flex-col gap-6 d:hidden">
        <section className="pt-6">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">소식</h2>
          <NewsBannerSlider />
        </section>

        <section className="w-full pt-6">
          <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">독서모임</h2>
          <div className="flex gap-6 justify-center">
            <HomeBookclub groups={groups} />
            <ListSubscribeLarge
              height="h-[424px]"
              users={recommendedUsers}
              isError={isErrorMembers}
              onSubscribeClick={handleToggleFollow}
            />
          </div>
        </section>

        <section className="pt-6">
          <HomeStoryList
            recommendedUsers={recommendedUsers}
            isErrorMembers={isErrorMembers}
            onToggleFollow={handleToggleFollow}
          />
        </section>
      </div>

      {/* 데스크톱 */}
      <div className="hidden d:flex flex-col gap-6 w-full">
        <div className="flex flex-row gap-6 w-full pt-6">
          <section className="w-[332px] shrink-0">
            <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">독서모임</h2>
            <HomeBookclub groups={groups} />
          </section>
          <section className="flex-1">
            <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">소식</h2>
            <NewsBannerSlider />
          </section>
        </div>

        <section className="w-full pt-6">
          <HomeStoryList
            recommendedUsers={recommendedUsers}
            isErrorMembers={isErrorMembers}
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
