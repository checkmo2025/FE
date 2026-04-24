"use client";

import Image from "next/image";
import React from "react";
import ClubCategoryTags from "./search_club_category_tags";
import type { ApplyType, ParticipantType } from "@/types/groups/groups";
import type { ClubCategoryDTO } from "@/types/groups/clubsearch";
const DEFAULT_CLUB_IMG = "/default_profile_1.svg";

// participantTypes 한글 매핑
const PARTICIPANT_KO: Record<string, string> = {
  STUDENT: "대학생",
  WORKER: "직장인",
  ONLINE: "온라인",
  CLUB: "동아리",
  MEETING: "모임",
  OFFLINE: "대면",
};

const APPLY_META: Record<
  ApplyType,
  { label?: string; icon?: string; labelClass?: string }
> = {
  No: {},
  Wait: { label: "신청 완료", icon: "/GreenCheck.svg", labelClass: "text-green-600" },
  Yes: { label: "가입 됨", icon: "/BrownCheck.svg", labelClass: "text-primary-3" },
};

export type ClubSummary = {
  reason: string;
  clubId: number;
  name: string;
  profileImageUrl?: string | null;
  category: ClubCategoryDTO[];
  public: boolean;
  applytype: ApplyType;
  region: string;
  participantTypes: ParticipantType[];
};

type Props = {
  club: ClubSummary;
  onClickVisit?: (clubId: number) => void;
  onClickApply?: (clubId: number) => void;

  onSubmitApply: (clubId: number, reason: string) => void;
  onCloseApply: () => void;
  applyOpenId: number | null;
};

function safeImageSrc(src?: string | null) {
  if (!src) return DEFAULT_CLUB_IMG;

  if (src === "string") return DEFAULT_CLUB_IMG;
  if (src.startsWith("/")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  return DEFAULT_CLUB_IMG;
}


export default function SearchClubListItem({
  club,
  onClickVisit,
  onClickApply,
  applyOpenId,
  onCloseApply,
  onSubmitApply,
}: Props) {

  const imgSrc = safeImageSrc(club.profileImageUrl);
  const isOpen = applyOpenId === club.clubId;

  const [reason, setReason] = React.useState("");
  React.useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const participantText = club.participantTypes
    .map((t) => PARTICIPANT_KO[t] ?? t)
    .join(", ");

  const applyMeta = APPLY_META[club.applytype];

  return (
    <div
      className={[
        "w-full max-w-[1440px] p-4",
        "rounded-[8px] border-2 border-Subbrown-4 bg-White",
        "flex flex-col gap-4",
        "t:h-[180px]",
      ].join(" ")}
    >
      <div className="flex justify-between">
        {/* Left - Tablet */}
        <div className="hidden t:flex flex-1 items-start gap-6 min-w-0">
          <div className="relative shrink-0 w-[148px] h-[148px] rounded-[8px] overflow-hidden">
            <Image
              src={imgSrc}
              alt="모임 이미지"
              fill
              sizes="148px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="min-w-0">
              <p className="subhead_2 text-Gray-7 truncate">{club.name}</p>
              <div className="mt-1">
                <ClubCategoryTags category={club.category} />
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <p className="body_1_2 text-Gray-4">
                모임 대상 : <span className="text-Gray-7">{participantText || "-"}</span>
              </p>
              <p className="body_1_2 text-Gray-4">
                활동 지역 : <span className="text-Gray-7">{club.region}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Left - Mobile */}
        <div className="t:hidden flex flex-1 flex-col min-w-0">
          <div className="min-w-0">
            <p className="body_1 text-Gray-7 truncate">{club.name}</p>
            <div className="mt-1">
              <ClubCategoryTags category={club.category} className="body_2_2" />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="relative shrink-0 w-[148px] h-[148px] rounded-[8px] overflow-hidden">
              <Image
                src={imgSrc}
                alt="모임 이미지"
                fill
                sizes="148px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="body_2_2 text-Gray-4">
                모임 대상 : <span className="text-Gray-7">{participantText || "-"}</span>
              </p>
              <p className="body_2_2 text-Gray-4">
                활동 지역 : <span className="text-Gray-7">{club.region}</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="shrink-0 flex flex-col items-end t:justify-between t:h-full">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <span className="body_1_2 text-Gray-4">{club.public ? "공개" : "비공개"}</span>
              <Image src={club.public ? "/Unlock.svg" : "/lock.svg"} alt="" width={16} height={16} />
            </div>

            {applyMeta.label && (
              <div className="flex items-center gap-1">
                <span className={["body_1_2", applyMeta.labelClass ?? "text-Gray-4"].join(" ")}>
                  {applyMeta.label}
                </span>
                {applyMeta.icon && <Image src={applyMeta.icon} alt="" width={16} height={16} />}
              </div>
            )}
          </div>

          <div className="w-[100px] t:w-[132px] mt-auto">
            {club.applytype === "No" && (
              <button
                type="button"
                onClick={() => onClickApply?.(club.clubId)}
                className={[
                  "h-[28px] t:h-[40px] px-4 py-2 w-full",
                  "flex items-center justify-center",
                  "rounded-[8px]",
                  "bg-primary-2 text-White",
                  "body_2_2 t:body_1_2",
                  "mb-1",
                ].join(" ")}
              >
                <span className="t:hidden">{isOpen ? "신청 닫기" : "가입신청하기"}</span>
                <span className="hidden t:inline">가입신청하기</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onClickVisit?.(club.clubId)}
              className={[
                "h-[28px] t:h-[40px] px-4 py-2 w-full",
                "flex items-center justify-center gap-[10px]",
                "rounded-[8px]",
                "border border-primary-1",
                "bg-background text-primary-3",
                "body_2_2 t:body_1_2",
              ].join(" ")}
            >
              방문하기
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 모바일에서만: 아이템 아래로 확장 신청폼 */}
      {club.applytype === "No" && isOpen && (
        <div className="t:hidden w-full">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 300))}
            placeholder="신청 사유를 입력해보세요(300자 제한)"
            className="w-full min-h-[220px] rounded-[12px] bg-Gray-1 p-4 body_2_2 outline-none"
          />
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => onSubmitApply(club.clubId, reason)}
            className={[
              "mt-4 w-full h-[44px] rounded-[10px] body_1_2",
              reason.trim() ? "bg-primary-2 hover:bg-primary-1 text-White" : "bg-Gray-2 text-Gray-4",
            ].join(" ")}
          >
            가입신청하기
          </button>
        </div>
      )}
    </div>
  );
}