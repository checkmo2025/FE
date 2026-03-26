"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import ClubCategoryTags from "@/components/base-ui/Group-Search/search_clublist/search_club_category_tags";
import ButtonWithoutImg from "@/components/base-ui/button_without_img";
import GroupAdminMenu from "@/components/base-ui/Group/group_admin_menu";

import { useClubhomeQueries } from "@/hooks/queries/useClubhomeQueries";
import { isClubMember } from "@/hooks/useClubAccessGuard";

const DEFAULT_CLUB_IMG = "/ClubDefaultImg.svg";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.id);

  const { meQuery, homeQuery, latestNoticeQuery, nextMeetingQuery } = useClubhomeQueries(groupId);

  const isLoading =
    meQuery.isLoading || homeQuery.isLoading || latestNoticeQuery.isLoading || nextMeetingQuery.isLoading;

  const isError = meQuery.isError || homeQuery.isError;

  const [isContactOpen, setIsContactOpen] = useState(false);

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
  const latestNotice = latestNoticeQuery.data; // null/undefined 가능
  

  const isAdmin = me.staff === true;
  const canAccessMemberOnlyPage = isClubMember(me);
  
  const noticeText = latestNotice?.title ?? "공지사항이 없습니다.";
  const hasNotice = Boolean(latestNotice?.id);
  const noticenumber = latestNotice?.id;
  const noticeUrl = `/groups/${groupId}/notice/${noticenumber}`;
  

  const imgSrc = home.profileImageUrl || DEFAULT_CLUB_IMG;
  const clubName = home.name;

  const participantText = (home.participantTypes ?? []).map((p) => p.description).join(", ");

  // 다음 모임
  const nextMeeting = nextMeetingQuery.data; // null 가능
  const joinMeetingId = nextMeeting?.meetingId ?? null;
  const joinUrl = joinMeetingId ? `/groups/${groupId}/bookcase/${joinMeetingId}` : null;

  const modalLinks = useMemo(() => {
    const list = home.links ?? [];
    return list
      .map((x, idx) => {
        const raw = (x.link ?? "").trim();
        if (!raw) return null;

        const url = /^(https?:\/\/)/i.test(raw) ? raw : `http://${raw}`;

        const label = (x.label ?? "").trim() || `링크 ${idx + 1}`;

        return { id: `${idx}`, url, label };
      })
      .filter(Boolean) as { id: string; url: string; label: string }[];
  }, [home.links]);

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

  return (
    <main className="w-full">
      {/* ✅ 원래 UI 그대로: max 1024, t px-3, d px-0 */}
      <div className="t:mx-auto d:mx-0 w-full max-w-[1024px] t:px-3 d:px-0">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!canAccessMemberOnlyPage) {
              toast.error("회원만 접근이 가능합니다.");
              return;
            }
            if (!hasNotice) {
              toast.error("공지사항이 없습니다.");
              return;
            }
            router.push(noticeUrl!);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            if (!canAccessMemberOnlyPage) {
              toast.error("회원만 접근이 가능합니다.");
              return;
            }
            if (!hasNotice) {
              toast.error("공지사항이 없습니다.");
              return;
            }
            router.push(noticeUrl!);
          }}
          className="
            block w-full
            rounded-[8px]
            border border-Subbrown-3
            bg-White
            p-4
            cursor-pointer
            hover:brightness-98 hover:-translate-y-[1px]
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-Subbrown-2
          "
          aria-label="공지사항"
        >
          <div className="flex items-center gap-3">
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

            <p className="body_1_2 text-Gray-5 min-w-0 truncate">{noticeText}</p>
          </div>
        </div>

        {/* 본문 */}
        <div className="mt-4">
          {/* ✅ Desktop (d): 원래 2컬럼 구조 그대로 */}
          <div className="hidden d:flex items-stretch gap-6">
            {/* 2) 이미지 */}
            <div
              className="
                relative shrink-0 overflow-hidden
                d:w-[300px] d:h-[300px]
                rounded-[4px]
                bg-Gray-1
              "
            >
              <Image src={imgSrc} alt={`${clubName} 프로필 이미지`} fill className="object-cover" sizes="300px" priority />
            </div>

            {/* 3) 텍스트 + 4) 버튼 (같은 컬럼) */}
            <div className="min-w-0 flex-1 flex flex-col min-h-[300px] relative">
              {/* 운영진용 모임 관리 드롭다운 */}
              {isAdmin && (
                <div className="absolute top-0 right-0 z-10">
                  <GroupAdminMenu groupId={Number(groupId)} />
                </div>
              )}

              <div className={isAdmin ? "pr-[113px]" : ""}>
                {/* ✅ category는 DTO 그대로(라벨 보여주기) */}
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

              {/* 버튼: 글 하단 */}
              <div className="mt-auto pt-6 flex gap-3">
                <ButtonWithoutImg
                  text="이번 모임 바로가기"
                  onClick={onClickJoin}
                  bgColorVar="--Primary_1"
                  borderColorVar="--Primary_1"
                  textColorVar="--White"
                  className="w-[300px] h-[44px] body_1 hover:brightness-90 hover:-translate-y-[1px] cursor-pointer"
                />

                {/* 링크가 있으면 Contact 활성, 없으면 toast */}
                <ButtonWithoutImg
                  text="Contact US"
                  onClick={() => {
                    if (modalLinks.length === 0) {
                      toast.error("연락처/링크 정보가 없습니다.");
                      return;
                    }
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

          {/* ✅ Mobile/Tablet: 원래 구조 그대로 */}
          <div className="flex flex-col gap-6 d:hidden">
            <div className="flex flex-col gap-4 t:flex-row t:items-start t:gap-6">
              {/* 2) 이미지 */}
              <div
                className="
                  relative shrink-0 overflow-hidden
                  w-[110px] h-[110px]
                  t:w-[300px] t:h-[300px]
                  rounded-[4px]
                  bg-Gray-1
                "
              >
                <Image src={imgSrc} alt={`${clubName} 프로필 이미지`} fill priority className="object-cover" />
              </div>

              {/* 3) 내용 */}
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

            {/* 버튼 태블릿/모바일 (전체 하단) */}
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
                  if (modalLinks.length === 0) {
                    toast.error("연락처/링크 정보가 없습니다.");
                    return;
                  }
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
      </div>

      {/* Contact Modal (원래 UI 그대로, 데이터만 home.links로 채움) */}
      {isContactOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/30
            px-4
          "
          onClick={() => setIsContactOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="
              w-full
              max-w-[500px]
              rounded-[8px]
              bg-background
              px-[20px] py-[24px]
              flex flex-col items-start gap-6
              max-t:w-[339px]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between">
              <p className="subhead_4_1 text-Gray-7 ">Contact Us</p>

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
                className="
                  w-full
                  flex items-center gap-2
                  px-5 py-[10px]
                  border-b border-Subbrown-4
                  last:border-b-0
                  hover:bg-Subbrown-4/40
                  text-left
                "
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