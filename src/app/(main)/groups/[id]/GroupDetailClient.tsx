"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

import ClubCategoryTags from "@/components/base-ui/Group-Search/search_clublist/search_club_category_tags";
import ButtonWithoutImg from "@/components/base-ui/button_without_img";
import GroupAdminMenu from "@/components/base-ui/Group/group_admin_menu";

import { clubhomeKeys, useClubhomeQueries, useClubParticipantsInfiniteQuery } from "@/hooks/queries/useClubhomeQueries";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { isClubMember } from "@/hooks/useClubAccessGuard";
import { useAuthStore } from "@/store/useAuthStore";
import FollowItem from "@/components/base-ui/Profile/Follow/FollowItem";

const DEFAULT_CLUB_IMG = "/default_profile_1.svg";
const PRIVATE_PARTICIPANTS_MESSAGE = "모임 회원은 가입 후에 조회 가능합니다";

export default function GroupDetailClient() {
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.id);
  const queryClient = useQueryClient();
  const currentNickname = useAuthStore((state) => state.user?.nickname);
  const toggleFollowMutation = useToggleFollowMutation();

  const { meQuery, homeQuery, latestNoticeQuery, nextMeetingQuery } = useClubhomeQueries(groupId);
  const participantsQuery = useClubParticipantsInfiniteQuery(groupId, Number.isFinite(groupId) && groupId > 0);

  // 회원 목록 무한 스크롤 (하단 sentinel이 보이면 다음 페이지 자동 로드)
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({ rootMargin: "200px" });
  useEffect(() => {
    if (loadMoreInView && participantsQuery.hasNextPage && !participantsQuery.isFetchingNextPage) {
      participantsQuery.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreInView, participantsQuery.hasNextPage, participantsQuery.isFetchingNextPage, participantsQuery.fetchNextPage]);

  const isLoading =
    meQuery.isLoading || homeQuery.isLoading || latestNoticeQuery.isLoading || nextMeetingQuery.isLoading;

  const isError = meQuery.isError || homeQuery.isError;

  const [isContactOpen, setIsContactOpen] = useState(false);

  const modalLinks = useMemo(() => {
    const list = homeQuery.data?.links ?? [];
    return list
      .map((x, idx) => {
        const raw = (x.link ?? "").trim();
        if (!raw) return null;
        const url = /^(https?:\/\/)/i.test(raw) ? raw : `http://${raw}`;
        const label = (x.label ?? "").trim() || `링크 ${idx + 1}`;
        return { id: `${idx}`, url, label };
      })
      .filter(Boolean) as { id: string; url: string; label: string }[];
  }, [homeQuery.data?.links]);

  if (!Number.isFinite(groupId) || groupId <= 0) {
    return (
      <main className="w-full">
        <div className="t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0">
          잘못된 모임 ID
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="w-full">
        <div className="t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0">
          <div className="py-10 body_1_2 text-Gray-5">불러오는 중...</div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="w-full">
        <div className="t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0">
          <div className="py-10 body_1_2 text-Red">모임 정보를 불러오지 못했습니다.</div>
        </div>
      </main>
    );
  }

  const me = meQuery.data!;
  const home = homeQuery.data!;
  const latestNotice = latestNoticeQuery.data;

  const isAdmin = me.staff === true;
  const canAccessMemberOnlyPage = isClubMember(me);
  const participants = participantsQuery.data?.pages.flatMap((page) => page.clubMembers) ?? [];
  const totalParticipants = participantsQuery.data?.pages[0]?.totalCount ?? null;
  const participantsErrorMessage = participantsQuery.error?.message ?? "";
  const isParticipantsPrivateBlocked =
    participantsQuery.isError && participantsErrorMessage.includes(PRIVATE_PARTICIPANTS_MESSAGE);

  const noticeText = latestNotice?.title ?? "아직 등록된 공지사항이 없습니다.";
  const hasNotice = Boolean(latestNotice?.id);
  const noticenumber = latestNotice?.id;
  const noticeUrl = `/groups/${groupId}/notice/${noticenumber}`;

  const imgSrc = home.profileImageUrl || DEFAULT_CLUB_IMG;
  const clubName = home.name;

  const participantText = (home.participantTypes ?? []).map((p) => p.description).join(", ");

  const nextMeeting = nextMeetingQuery.data;
  const joinMeetingId = nextMeeting?.meetingId ?? null;
  const joinUrl = joinMeetingId ? `/groups/${groupId}/bookcase/${joinMeetingId}` : null;

  const onClickJoin = () => {
    if (!canAccessMemberOnlyPage) {
      toast.error("회원만 접근이 가능합니다.");
      return;
    }
    if (!joinUrl) {
      toast.error("다음 정기모임이 없습니다.");
      return;
    }
    router.push(joinUrl);
  };

  const handleToggleFollow = (id: string | number, isFollowing: boolean) => {
    toggleFollowMutation.mutate(
      {
        nickname: String(id),
        isFollowing,
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: clubhomeKeys.participants(groupId) });
        },
      }
    );
  };

  return (
    <main className="w-full">
      <div className="t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!canAccessMemberOnlyPage) { toast.error("회원만 접근이 가능합니다."); return; }
            if (!hasNotice) { toast.error("아직 등록된 공지사항이 없습니다."); return; }
            router.push(noticeUrl!);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            if (!canAccessMemberOnlyPage) { toast.error("회원만 접근이 가능합니다."); return; }
            if (!hasNotice) { toast.error("아직 등록된 공지사항이 없습니다."); return; }
            router.push(noticeUrl!);
          }}
          className="block w-full rounded-[8px] border border-Subbrown-3 bg-White p-4 cursor-pointer hover:brightness-98 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Subbrown-2"
          aria-label="공지사항"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-[4px] bg-Secondary-2 py-[4px] px-[8px] flex items-center justify-center">
              <Image src="/Notification3.svg" alt="공지" width={16} height={16} className="object-contain" />
            </div>
            <p className="body_1_2 text-Gray-5 min-w-0 truncate">{noticeText}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="hidden d:flex items-stretch gap-6">
            <div className="relative shrink-0 overflow-hidden d:w-[300px] d:h-[300px] rounded-[4px] bg-Gray-1">
              <Image src={imgSrc} alt={`${clubName} 프로필 이미지`} fill className="object-cover" sizes="300px" priority />
            </div>

            <div className="min-w-0 flex-1 flex flex-col min-h-[300px] relative">
              {isAdmin && (
                <div className="absolute top-0 right-0 z-10">
                  <GroupAdminMenu groupId={Number(groupId)} />
                </div>
              )}
              <div className={isAdmin ? "pr-[113px]" : ""}>
                <ClubCategoryTags category={home.category ?? []} />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">모임 대상</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 wrap-break-word">{participantText || "-"}</p>
                </div>
                <div className="flex items-start gap-3">
                  <p className="body_1_3 text-Gray-5 shrink-0">활동 지역</p>
                  <p className="body_1_3 text-Gray-7 min-w-0 wrap-break-word">{home.region ?? "-"}</p>
                </div>
              </div>
              <div className="mt-[19px]">
                <p className="body_1_3 text-Gray-5 mt-2 whitespace-pre-line wrap-break-word">
                  {home.description ?? "설명이 없습니다."}
                </p>
              </div>
              <div className="mt-auto pt-6 flex gap-3">
                <ButtonWithoutImg
                  text="이번 모임 바로가기"
                  onClick={onClickJoin}
                  bgColorVar="--Primary_1"
                  borderColorVar="--Primary_1"
                  textColorVar="--White"
                  className="w-[300px] h-[44px] body_1 hover:brightness-90 hover:-translate-y-[1px] cursor-pointer"
                />
                <ButtonWithoutImg
                  text="Contact US"
                  onClick={() => {
                    if (modalLinks.length === 0) { toast.error("연락처/링크 정보가 없습니다."); return; }
                    setIsContactOpen(true);
                  }}
                  bgColorVar="--Subbrown_4"
                  borderColorVar="--Subbrown_2"
                  textColorVar="--Primary_3"
                  className="w-[300px] h-[44px] body_1 hover:brightness-95 hover:-translate-y-[1px] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 d:hidden">
            <div className="flex flex-col gap-4 t:flex-row t:items-start t:gap-6">
              <div className="relative shrink-0 overflow-hidden w-[110px] h-[110px] t:w-[300px] t:h-[300px] rounded-[4px] bg-Gray-1">
                <Image src={imgSrc} alt={`${clubName} 프로필 이미지`} fill priority className="object-cover" />
              </div>
              <div className="min-w-0 flex-1 relative">
                {isAdmin && (
                  <div className="absolute top-0 right-0 z-10">
                    <GroupAdminMenu groupId={Number(groupId)} />
                  </div>
                )}
                <div className={isAdmin ? "pr-[110px]" : ""}>
                  <ClubCategoryTags category={home.category ?? []} />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-3">
                    <p className="body_1_3 text-Gray-5 shrink-0">모임 대상</p>
                    <p className="body_1_3 text-Gray-7 min-w-0 wrap-break-word">{participantText || "-"}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="body_1_3 text-Gray-5 shrink-0">활동 지역</p>
                    <p className="body_1_3 text-Gray-7 min-w-0 wrap-break-word">{home.region ?? "-"}</p>
                  </div>
                </div>
                <div className="mt-[19px]">
                  <p className="body_1_3 text-Gray-5 mt-2 whitespace-pre-line wrap-break-word">
                    {home.description ?? "설명이 없습니다."}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col t:flex-row gap-3">
              <ButtonWithoutImg
                text="이번 모임 바로가기"
                onClick={onClickJoin}
                bgColorVar="--Primary_1"
                borderColorVar="--Primary_1"
                textColorVar="--White"
                className="w-full d:w-[300px] h-[44px] body_1 hover:brightness-90 hover:-translate-y-[1px] cursor-pointer"
              />
              <ButtonWithoutImg
                text="Contact US"
                onClick={() => {
                  if (modalLinks.length === 0) { toast.error("연락처/링크 정보가 없습니다."); return; }
                  setIsContactOpen(true);
                }}
                bgColorVar="--Subbrown_4"
                borderColorVar="--Subbrown_2"
                textColorVar="--Primary_3"
                className="w-full d:w-[300px] h-[44px] body_1 hover:brightness-95 hover:-translate-y-[1px] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <section className="mt-10 w-full">
          <div className="mb-4 flex flex-col gap-1 t:flex-row t:items-end t:justify-between">
            <div>
              <h2 className="subhead_3_1 text-Gray-7">모임 회원</h2>
              <p className="body_1_3 text-Gray-4">
                {totalParticipants == null ? "참여 인원을 확인하고 있습니다." : `총 ${totalParticipants}명`}
              </p>
            </div>
          </div>

          {participantsQuery.isLoading && (
            <div className="rounded-[8px] border border-Subbrown-3 bg-White px-4 py-6 body_1_2 text-Gray-5">
              모임 회원 불러오는 중...
            </div>
          )}

          {!participantsQuery.isLoading && isParticipantsPrivateBlocked && (
            <div className="rounded-[8px] border border-Subbrown-3 bg-White px-4 py-6 body_1_2 text-Gray-5">
              {PRIVATE_PARTICIPANTS_MESSAGE}
            </div>
          )}

          {!participantsQuery.isLoading && participantsQuery.isError && !isParticipantsPrivateBlocked && (
            <div className="rounded-[8px] border border-Subbrown-3 bg-White px-4 py-6 body_1_2 text-Red">
              모임 회원을 불러오지 못했습니다.
            </div>
          )}

          {!participantsQuery.isLoading && !participantsQuery.isError && participants.length === 0 && (
            <div className="rounded-[8px] border border-Subbrown-3 bg-White px-4 py-6 body_1_2 text-Gray-5">
              아직 참여 중인 회원이 없습니다.
            </div>
          )}

          {!participantsQuery.isLoading && !participantsQuery.isError && participants.length > 0 && (
            <div className="flex w-full flex-col items-start gap-2">
              {participants.map((participant) => {
                const isMe = currentNickname === participant.nickname;
                const roleLabel =
                  participant.clubMemberStatus === "OWNER"
                    ? "개설자"
                    : participant.clubMemberStatus === "STAFF"
                      ? "운영진"
                      : "회원";

                return (
                  <FollowItem
                    key={participant.clubMemberId}
                    user={{
                      id: participant.nickname,
                      nickname: participant.nickname,
                      profileImageUrl: participant.profileImageUrl ?? undefined,
                      isFollowing: participant.following,
                    }}
                    onToggleFollow={handleToggleFollow}
                    hideFollow={isMe}
                    subLabel={roleLabel}
                    badge={
                      participant.staff ? (
                        <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-Subbrown-4 px-2 text-[12px] font-medium leading-none text-primary-3">
                          <Image src="/admin.svg" alt="" width={14} height={14} className="object-contain" />
                          운영진
                        </span>
                      ) : undefined
                    }
                  />
                );
              })}

              {participantsQuery.hasNextPage && (
                <div ref={loadMoreRef} className="h-5 w-full shrink-0" />
              )}
              {participantsQuery.isFetchingNextPage && (
                <div className="w-full py-3 text-center body_2_3 text-Gray-4">불러오는 중...</div>
              )}
            </div>
          )}
        </section>
      </div>

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setIsContactOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[500px] rounded-[8px] bg-background px-[20px] py-[24px] flex flex-col items-start gap-6 max-t:w-[339px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between">
              <p className="subhead_4_1 text-Gray-7">Contact Us</p>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="shrink-0 hover:brightness-0 cursor-pointer hover:scale-[1.07]"
                aria-label="닫기"
              >
                <Image src="/icon_minus_1.svg" alt="" width={24} height={24} className="object-contain" />
              </button>
            </div>
            <div className="w-full rounded-[8px] overflow-hidden items-center">
              {modalLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  className="w-full flex items-center gap-2 px-5 py-[10px] border-b border-Subbrown-4 last:border-b-0 hover:bg-Subbrown-4/40 text-left"
                >
                  <Image src="/link.svg" alt="" width={24} height={24} className="object-contain shrink-0" />
                  <p className="text-Gray-5 body_2_3 t:body_1_3 truncate">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
