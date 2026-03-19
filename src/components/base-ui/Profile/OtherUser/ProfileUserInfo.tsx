"use client";

import Image from "next/image";
import { useOtherProfileQuery } from "@/hooks/queries/useMemberQueries";

import { useToggleFollowMutation, useReportMemberMutation } from "@/hooks/mutations/useMemberMutations";
import { ReportType } from "@/types/member";
import { useState } from "react";
import ReportModal from "@/components/common/ReportModal";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

// [보조 컴포넌트] 액션 버튼 (구독하기 / 신고하기)
function ActionButton({
  variant,
  label,
  onClick,
}: {
  variant: "primary" | "secondary" | "following";
  label: string;
  onClick?: () => void;
}) {
  const baseStyles =
    "flex items-center justify-center rounded-[8px] transition-colors";

  const variants = {
    primary:
      "bg-primary-1 text-White font-semibold md:font-medium w-[220px] h-[32px] md:w-[486px] md:h-[48px] lg:w-[532px]",

    following:
      "bg-[var(--Subbrown_4)] text-primary-3 font-semibold md:font-medium w-[220px] h-[32px] md:w-[486px] md:h-[48px] lg:w-[532px]",

    secondary:
      "bg-White border border-Subbrown-3 text-Gray-4 font-medium hover:bg-gray-50 w-[100px] h-[32px] md:w-[178px] md:h-[48px]",
  };

  const textStyles = "body_1_2 md:subhead_4_1";

  return (
    <button type="button" onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      <span className={textStyles}>{label}</span>
    </button>
  );
}

// [보조 컴포넌트] 통계 아이템 (구독 중 / 구독자)
function StatItem({ label, count, href }: { label: string; count: number, href: string }) {
  return (
    <Link href={href} className="flex items-center gap-[4px] hover:opacity-70 transition-opacity">
      {/* Label: Gray-4 */}
      <span className="text-Gray-4 body_1_2 md:subhead_4_1">{label}</span>
      {/* Count: primary-1 */}
      <span className="text-primary-1 body_1_2 md:subhead_4_1">{count}</span>
    </Link>
  );
}

export default function ProfileUserInfo({ nickname }: { nickname: string }) {
  const decodedNickname = nickname ? decodeURIComponent(nickname) : "";
  const { data: profile, isLoading } = useOtherProfileQuery(decodedNickname);
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const { mutate: toggleFollow } = useToggleFollowMutation();
  const { mutate: reportMember } = useReportMemberMutation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 w-full min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B6154]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-10 text-Gray-5 body_1 min-h-[200px]">
        프로필 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const handleToggleFollow = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleFollow({ nickname: decodedNickname, isFollowing: profile.following });
  };

  const handleReportSubmit = (type: string, content: string) => {
    let mappedType: ReportType = "GENERAL";
    if (type === "책 이야기") mappedType = "BOOK_STORY";
    if (type === "책이야기(댓글)") mappedType = "COMMENT";
    if (type === "책모임 내부") mappedType = "CLUB_MEETING";

    reportMember({
      reportedMemberNickname: decodedNickname,
      reportType: mappedType,
      content,
    });
  };

  return (
    <div className="flex flex-col items-start w-full max-w-[1440px] gap-[24px] md:gap-[80px] px-[18px] md:px-[40px] lg:px-0 mx-auto">
      <div
        className="flex flex-col items-start w-full max-w-[734px] gap-[24px] md:gap-[40px] mx-auto"
      >
        {/* 1. 상단 정보 섹션 (이미지 + 텍스트) */}
        <div
          className="flex w-full items-start
          flex-row gap-[24px]
          md:items-center md:gap-[38px]"
        >
          {/* 프로필 이미지 */}
          <div
            className="relative shrink-0 overflow-hidden rounded-full border border-Subbrown-3 bg-background
            h-[80px] w-[80px]
            md:h-[138px] md:w-[138px]"
          >
            <Image
              src={profile.profileImageUrl || "/profile2.svg"}
              alt={`${profile.nickname}님의 프로필`}
              fill
              className="object-cover"
            />
          </div>

          {/* 텍스트 정보 영역 */}
          <div
            className="flex flex-col items-start
            w-[189px] gap-[12px]
            md:w-[512px] md:items-center lg:w-[558px]"
          >
            {/* 닉네임 & 통계 */}
            <div className="flex w-full flex-col gap-[8px] items-start md:items-start">
              {/* 닉네임 */}
              <h1 className="text-Gray-7 subhead_3 md:subhead_1">{profile.nickname}</h1>

              {/* 통계 그룹 */}
              <div className="flex items-center gap-[12px]">
                <StatItem
                  label="구독중"
                  count={profile.followingCount}
                  href={`/profile/${profile.nickname}/follows?tab=following`}
                />
                <StatItem
                  label="구독자"
                  count={profile.followerCount}
                  href={`/profile/${profile.nickname}/follows?tab=follower`}
                />
              </div>
            </div>

            {/* 소개글 */}
            <p className="w-full text-left break-keep text-Gray-4 body_2_3 md:body_1_2 line-clamp-3 md:line-clamp-none">
              {profile.description || "이 사용자는 소개를 작성하지 않았습니다."}
            </p>
          </div>
        </div>

        {/* 2. 하단 버튼 그룹 */}
        <div className="flex w-full justify-center md:justify-start items-center gap-[19px] md:gap-[24px]">
          <ActionButton
            variant={profile.following ? "following" : "primary"}
            label={profile.following ? "구독중" : "구독하기"}
            onClick={handleToggleFollow}
          />
          <ActionButton
            variant="secondary"
            label="신고하기"
            onClick={() => {
              if (!isLoggedIn) {
                openLoginModal();
                return;
              }
              setIsReportModalOpen(true);
            }}
          />
        </div>

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          defaultReportType="일반"
        />
      </div>
    </div>
  );
}
