"use client";

import type { ClubSummary } from "@/components/base-ui/Group-Search/search_clublist/search_clublist_item";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClubCategoryTags from "./search_clublist/search_club_category_tags";

const DEFAULT_CLUB_IMG = "/ClubDefaultImg.svg";

const PARTICIPANT_KO: Record<string, string> = {
  STUDENT: "대학생",
  WORKER: "직장인",
  ONLINE: "온라인",
  CLUB: "동아리",
  MEETING: "모임",
  OFFLINE: "대면",
};

type Props = {
  open: boolean;
  club: ClubSummary | null;
  onClose: () => void;
  onSubmit: (clubId: number, reason: string) => void;
};

export default function SearchClubApplyModal({ open, club, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setReason("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const autoResize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (!open) return;
    autoResize();
    requestAnimationFrame(autoResize);
  }, [open]);

  if (!open || !club) return null;

  const imgSrc = club.profileImageUrl ?? DEFAULT_CLUB_IMG;
  const participantText =
    club.participantTypes?.map((t) => PARTICIPANT_KO[t] ?? t).join(", ") ?? "-";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className={[
            "w-full max-w-[1040px]",
            "flex flex-col items-end gap-4",
            "p-[28px]",
            "rounded-[12px] bg-White",
            "shadow-lg",
          ].join(" ")}
        >
          <div className="w-full flex items-start justify-between gap-6">
            <div className="flex items-start gap-6 min-w-0">
              <Image
                src={imgSrc}
                alt="모임 이미지"
                width={148}
                height={148}
                className="shrink-0 rounded-[8px] object-cover"
              />

              <div className="min-w-0">
                <p className="subhead_2 text-Gray-7">{club.name}</p>
                <div className="mt-2">
                  <ClubCategoryTags category={club.category} />
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  <p className="body_1_2 text-Gray-4">
                    모임 대상 : <span className="text-Gray-7">{participantText}</span>
                  </p>
                  <p className="body_1_2 text-Gray-4">
                    활동 지역 : <span className="text-Gray-7">{club.region}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button type="button" onClick={onClose} className="shrink-0">
                <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <span className="body_2_2 text-Gray-4">{club.public ? "공개" : "비공개"}</span>
                <Image src={club.public ? "/Unlock.svg" : "/lock.svg"} alt="" width={20} height={20} />
              </div>
            </div>
          </div>

          <div className="w-full">
            <textarea
              ref={taRef}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                autoResize();
              }}
              maxLength={300}
              placeholder="신청 사유를 입력해주세요(300자 제한)"
              className={[
                "w-full",
                "resize-none overflow-hidden",
                "rounded-[8px] bg-Gray-1 p-4",
                "outline-none",
                "body_1_2 text-Gray-7 placeholder:text-Gray-3",
              ].join(" ")}
              rows={4}
            />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => onSubmit(club.clubId, reason)}
              className={[
                "h-[40px] px-4 rounded-[8px]",
                "bg-primary-2 text-White border border-primary-2",
                "body_1_2",
              ].join(" ")}
              disabled={reason.trim().length === 0}
            >
              가입 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}