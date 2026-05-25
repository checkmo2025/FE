"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { ReportReason, ReportTarget } from "@/types/report";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: any, content: string) => void;
  target?: ReportTarget;
  defaultReportType?: string;
};

const TITLE_MAP: Record<string, string> = {
  MEMBER: "사용자 / 신고하기",
  CLUB: "모임 신고하기",
  BOOK_STORY: "책이야기 / 신고하기",
  BOOK_STORY_COMMENT: "책이야기 댓글 / 신고하기",
  CLUB_NOTICE: "공지사항 / 신고하기",
  CLUB_NOTICE_COMMENT: "공지사항 댓글 / 신고하기",
  CLUB_TOPIC: "발제 / 신고하기",
  CLUB_BOOK_REVIEW: "한줄평 / 신고하기",
  CHAT: "채팅 / 신고하기"
};

const REASON_MAP: Record<string, ReportReason> = {
  "일반": "GENERAL",
  "욕설/비방": "INSULT",
  "음란/부적절": "INAPPROPRIATE_CONTENT",
  "홍보/도배": "SPAM",
};

const REASONS: { label: string; key: ReportReason }[] = [
  { label: "일반", key: "GENERAL" },
  { label: "욕설/비방", key: "INSULT" },
  { label: "음란/부적절", key: "INAPPROPRIATE_CONTENT" },
  { label: "홍보/도배", key: "SPAM" },
];

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  target: propTarget,
  defaultReportType,
}: ReportModalProps) {
  const target: ReportTarget = propTarget || {
    type: defaultReportType === "책 이야기" ? "BOOK_STORY" : "MEMBER",
    id: "",
    nickname: defaultReportType === "책 이야기" ? "책이야기" : "사용자",
    profileImageUrl: "",
    title: "",
  };

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [content, setContent] = useState("");

  const isSubmitEnabled = selectedReason !== null && content.trim().length > 0;

  useScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      setSelectedReason(null);
      setContent("");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setContent(e.target.value);
    }
  };

  const handleRegister = () => {
    if (selectedReason && isSubmitEnabled) {
      onSubmit(selectedReason, content);
      onClose();
    }
  };

  // Helper to slice book story title to first 10 characters
  const getTruncatedTitle = (title?: string) => {
    if (!title) return "";
    return title.length > 10 ? `${title.slice(0, 10)}...` : title;
  };

  const isBookStory = target.type === "BOOK_STORY";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 40, mass: 0.1 }}
          className={`relative flex flex-col items-start gap-[16px] p-[20px] md:p-[40px] rounded-[8px] border border-[#EAE5E2] bg-[#F9F7F6] ${
            isBookStory
              ? "w-[339px] h-[622px] md:w-[620px] md:h-[681px] lg:w-[698px] lg:h-[748px]"
              : "w-[339px] h-[622px] md:w-[620px] md:h-[681px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start w-full">
            <h2 className="text-[#2C2C2C] text-[22px] font-semibold leading-[135%] tracking-[-0.022px]">
              {target.type ? (TITLE_MAP[target.type] || "신고하기") : (defaultReportType === "책 이야기" ? "책이야기 / 신고하기" : "사용자 / 신고하기")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-[32px] h-[32px] relative cursor-pointer flex items-center justify-center"
            >
              {/* Custom Vector-drawn Close Sign for precision matching SVG vector properties */}
              <div className="w-[16px] h-[16px] relative">
                <span className="absolute w-[16px] h-[2px] bg-[#7B6154] rotate-45 top-1/2 left-0 -translate-y-1/2" />
                <span className="absolute w-[16px] h-[2px] bg-[#7B6154] -rotate-45 top-1/2 left-0 -translate-y-1/2" />
              </div>
            </button>
          </div>

          {/* Target Profile Info */}
          {target.type && (target.type !== "CLUB" || target.title) && (
            <div className="flex w-full items-center justify-between py-[13px] border-b border-[#EAE5E2] md:border-none">
              {target.type !== "CLUB" ? (
                <div className="flex items-center gap-[8px]">
                  <div className="relative w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full overflow-hidden border border-[#BBBBBB] bg-White shrink-0">
                    <Image
                      src={target.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                      alt={`${target.nickname || "사용자"} profile`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[#2C2C2C] text-[24px] font-semibold leading-[135%] tracking-[-0.024px] truncate max-w-[150px] md:max-w-[250px]">
                    {target.nickname || "사용자"}
                  </span>
                </div>
              ) : (
                <span className="text-[#BBBBBB] text-[18px] font-medium leading-[145%]">
                  신고 대상 모임
                </span>
              )}

              {target.type !== "MEMBER" && target.title && (
                <span className="text-[#2C2C2C] text-[20px] font-semibold leading-[135%] tracking-[-0.02px] text-right truncate max-w-[140px] md:max-w-[200px]">
                  {getTruncatedTitle(target.title)}
                </span>
              )}
            </div>
          )}

          {/* Reason (종류) Section */}
          <div className="flex flex-col items-start gap-[8px] w-full">
            <span className="text-[#BBBBBB] text-[14px] font-normal leading-[145%] tracking-[-0.014px] w-full">
              종류
            </span>

            {/* Desktop & Tablet: Row Layout */}
            <div className="hidden md:flex items-center gap-[12px] w-full">
              {REASONS.map((reason) => {
                const isSelected = selectedReason === reason.key;
                return (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => setSelectedReason(reason.key)}
                    className={`flex items-center justify-center p-[10px] rounded-[8px] border transition-colors cursor-pointer ${
                      isBookStory
                        ? "w-[110px] lg:w-[144px]"
                        : "w-[130px]"
                    } h-[45px] ${
                      isSelected
                        ? "border-[#7B6154] bg-[#7B6154] text-White"
                        : "border-[#DADADA] bg-[#EEEEEE] text-[#BBBBBB]"
                    }`}
                  >
                    <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
                      {reason.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile: 2x2 Grid using 2 columns (Frame 2087328881 / 2087328511 style) */}
            <div className="flex md:hidden flex-row justify-between gap-[8px] w-full h-[106px]">
              {/* Left Column (일반, 음란/부적절) */}
              <div className="flex flex-col justify-between gap-[16px] w-[140px]">
                {[REASONS[0], REASONS[2]].map((reason) => {
                  const isSelected = selectedReason === reason.key;
                  return (
                    <button
                      key={reason.key}
                      type="button"
                      onClick={() => setSelectedReason(reason.key)}
                      className={`flex items-center justify-center p-[10px] rounded-[8px] border transition-colors cursor-pointer w-[140px] h-[45px] ${
                        isSelected
                          ? "border-[#7B6154] bg-[#7B6154] text-White"
                          : "border-[#DADADA] bg-[#EEEEEE] text-[#BBBBBB]"
                      }`}
                    >
                      <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
                        {reason.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column (욕설/비방, 홍보/도배) */}
              <div className="flex flex-col justify-between gap-[12px] w-[140px]">
                {[REASONS[1], REASONS[3]].map((reason) => {
                  const isSelected = selectedReason === reason.key;
                  return (
                    <button
                      key={reason.key}
                      type="button"
                      onClick={() => setSelectedReason(reason.key)}
                      className={`flex items-center justify-center p-[10px] rounded-[8px] border transition-colors cursor-pointer w-[140px] h-[45px] ${
                        isSelected
                          ? "border-[#7B6154] bg-[#7B6154] text-White"
                          : "border-[#DADADA] bg-[#EEEEEE] text-[#BBBBBB]"
                      }`}
                    >
                      <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
                        {reason.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Textarea (내용) Section */}
          <div className="flex flex-col items-start gap-[8px] w-full flex-grow">
            <span className="text-[#BBBBBB] text-[14px] font-normal leading-[145%] tracking-[-0.014px] w-full">
              내용
            </span>
            <div className="w-full flex-grow rounded-[8px] bg-White p-[20px] flex items-start">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="신고 내용 작성 (최대 500자)"
                className="w-full h-full min-h-[172px] md:min-h-[244px] bg-transparent resize-none border-none focus:outline-none text-[#2C2C2C] text-[18px] font-normal leading-[135%] tracking-[-0.018px] placeholder:text-[#BBBBBB]"
              />
            </div>
          </div>

          {/* CTA Submit Button Section */}
          <div className="w-full mt-auto">
            <button
              type="button"
              disabled={!isSubmitEnabled}
              onClick={handleRegister}
              className={`flex h-[56px] w-full justify-center items-center rounded-[8px] transition-colors ${
                isSubmitEnabled
                  ? "bg-[#7B6154] text-White hover:bg-[#7B6154]/90 cursor-pointer"
                  : "bg-[#EEEEEE] text-[#BBBBBB] cursor-not-allowed"
              }`}
            >
              <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px]">
                신고 등록
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
