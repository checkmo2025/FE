"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ButtonWithoutImg from "@/components/base-ui/button_without_img";
import SearchGroupSearch from "@/components/base-ui/Group-Search/search_groupsearch";
import Mybookclub, { type GroupSummary } from "@/components/base-ui/Group-Search/search_mybookclub";

import SearchClubListItem, { type ClubSummary } from "@/components/base-ui/Group-Search/search_clublist/search_clublist_item";
import SearchClubApplyModal from "@/components/base-ui/Group-Search/search_club_apply_modal";

import type { Category, ParticipantType } from "@/types/groups/groups";
import type {
  ClubDTO,
  ClubListItemDTO,
  ClubSearchParams,
  InputFilter,
  OutputFilter,
  RecommendationItemDTO,
} from "@/types/groups/clubsearch";

import {
  useClubRecommendationsQuery,
  useInfiniteClubSearchQuery,
  useMyClubsQuery,
} from "@/hooks/queries/useSearchClubQueries";
import { useClubJoinMutation } from "@/hooks/mutations/useSearchClubMutations";
import { useAuthStore } from "@/store/useAuthStore";


function mapCategoryToOutputFilter(category: Category): OutputFilter {
  switch (category) {
    case "대학생":
      return "STUDENT";
    case "직장인":
      return "WORKER";
    case "온라인":
      return "ONLINE";
    case "동아리":
      return "CLUB";
    case "모임":
      return "MEETING";
    case "대면":
      return "OFFLINE";
    case "전체":
    default:
      return "ALL";
  }
}

function mapInputFilter(group: boolean, region: boolean): InputFilter | null {
  if (group && !region) return "NAME";
  if (!group && region) return "REGION";
  return null;
}
function mapApplyType(myStatus: string): "No" | "Wait" | "Yes" {
  if (myStatus === "NONE" || myStatus === "WITHDRAWN" || myStatus === "KICKED") {
    return "No";
  }
  if (myStatus === "MEMBER" || myStatus === "JOINED" || myStatus === "STAFF" || myStatus === "OWNER") {
    return "Yes";
  }
  return "Wait"; // PENDING 등
}


function mapClubDTOToSummary(club: ClubDTO, myStatus: string, reason = ""): ClubSummary {
  return {
    reason,
    clubId: club.clubId,
    name: club.name,
    profileImageUrl: club.profileImageUrl,
    category: club.category,
    public: club.open,
    applytype: mapApplyType(myStatus),
    region: club.region,
    participantTypes: club.participantTypes.map((p) => p.code as ParticipantType).filter(Boolean),
  };
}

function mapRecommendationItem(item: RecommendationItemDTO): ClubSummary {
  const reason = `겹치는 모임 ${item.overlapCount}개 · 활동멤버 ${item.activeMemberCount}명`;
  return mapClubDTOToSummary(item.clubInfo.club, item.clubInfo.myStatus, reason);
}

function mapSearchItem(item: ClubListItemDTO): ClubSummary {
  return mapClubDTOToSummary(item.club, item.myStatus);
}

export default function Searchpage() {
  const router = useRouter();
  const { isLoggedIn, isInitialized, openLoginModal } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      toast.error("모임은 로그인이 필요한 서비스입니다.", { id: "groups-auth-error" });
      router.replace("/");
      // 약간의 지연을 주어 홈으로 이동한 후 모달이 뜨게 함
      setTimeout(() => {
        openLoginModal();
      }, 100);
    }
  }, [isLoggedIn, isInitialized, router, openLoginModal]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("전체");
  const [group, setGroup] = useState(false);
  const [region, setRegion] = useState(false);

  const [appliedParams, setAppliedParams] = useState<Omit<ClubSearchParams, "cursorId"> | null>(null);

  const isSearchMode = appliedParams !== null;

  const [applyClubId, setApplyClubId] = useState<number | null>(null);

  const { data: myClubsData, isLoading: myClubsLoading } = useMyClubsQuery(isLoggedIn);
  const { data: recData, isLoading: recLoading } = useClubRecommendationsQuery(isLoggedIn && !isSearchMode);

  const {
    data: searchData,
    isFetching: searchFetching,
    hasNextPage,
    fetchNextPage,
    refetch: refetchSearch,
  } = useInfiniteClubSearchQuery(
    appliedParams ?? { keyword: undefined, inputFilter: null, outputFilter: "ALL" },
    isSearchMode
  );

  const { mutateAsync: joinAsync, isPending: joinPending } = useClubJoinMutation();

  const myGroups: GroupSummary[] = useMemo(() => {
    const list = myClubsData?.clubList ?? [];
    return list.map((c) => ({ id: String(c.clubId), name: c.clubName }));
  }, [myClubsData]);

  const recommendationClubs: ClubSummary[] = useMemo(() => {
    const list = recData?.recommendations ?? [];
    return list.map(mapRecommendationItem);
  }, [recData]);

  const searchedClubs: ClubSummary[] = useMemo(() => {
    const pages = searchData?.pages ?? [];
    return pages.flatMap((p) => p.clubList.map(mapSearchItem));
  }, [searchData]);

  const clubsToRender = isSearchMode ? searchedClubs : recommendationClubs;
  const selectedClub = clubsToRender.find((c) => c.clubId === applyClubId) ?? null;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSearchMode) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (hasNextPage && !searchFetching) fetchNextPage();
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isSearchMode, hasNextPage, searchFetching, fetchNextPage]);

  const onClickVisit = (clubId: number) => router.push(`/groups/${clubId}`);

  const onClickApply = (clubId: number) => setApplyClubId((prev) => (prev === clubId ? null : clubId));
  const onCloseApply = () => setApplyClubId(null);

  const onSubmitApply = async (clubId: number, reason: string) => {
    if (!reason.trim()) return;
    if (joinPending) return;

    try {
      const msg = await joinAsync({
        clubId,
        body: { joinMessage: reason.trim() },
      });
      toast.success(msg);
      setApplyClubId(null);
    } catch (e: any) {
      toast.error(e?.message ?? "가입 신청에 실패했습니다.");
    }
  };

  const onSubmitSearch = () => {
    const keyword = q.trim();

    if (!keyword) {
      setAppliedParams(null);
      return;
    }

    setAppliedParams({
      outputFilter: mapCategoryToOutputFilter(category),
      inputFilter: mapInputFilter(group, region),
      keyword,
    });

    refetchSearch();
  };

  return (
    <div className="max-w-[1440px] flex flex-col gap-6 d:flex-row mt-3 sm:mt-5 d:mt-6 mx-auto px-6">
      <aside className="d:w-[332px]">
        <p className="body_1 t:subhead_2">독서 모임</p>

        {/* 모바일 */}
        <div className="flex w-full t:hidden mt-5 mb-2">
          <ButtonWithoutImg
            text="+ 모임 생성하기"
            height={36}
            bgColorVar="--Primary_1"
            borderColorVar="--Primary_1"
            textColorVar="--White"
            className="flex-1 body_1 hover:brightness-95 hover:-translate-y-[1px] cursor-pointer"
            onClick={() => router.push("/groups/create")}
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
            className="flex-1 subhead_4_1 hover:brightness-95 hover:-translate-y-[1px] cursor-pointer"
            onClick={() => router.push("/groups/create")}
          />
        </div>

        <Mybookclub groups={myGroups} isLoading={myClubsLoading} />
      </aside>

      <main className="w-full max-w-[1440px]">
        <div>
          <p className="body_1 t:subhead_2">모임 검색하기</p>
          <div className="mt-4 d:mt-5 mb-5">
            <SearchGroupSearch
              value={q}
              onChange={setQ}
              onSubmit={onSubmitSearch}
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
            {clubsToRender.map((club) => (
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

          {!isSearchMode && recLoading && (
            <p className="mt-3 body_2_2 text-Gray-4">불러오는 중…</p>
          )}

          {isSearchMode && <div ref={sentinelRef} className="h-10" />}
        </div>
      </main>

      <div className="hidden t:block">
        <SearchClubApplyModal
          open={applyClubId !== null}
          club={selectedClub}
          onClose={onCloseApply}
          onSubmit={onSubmitApply}
        />
      </div>
    </div>
  );
}