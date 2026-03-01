"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NoticeItem from "@/components/base-ui/Group/notice_item";
import FloatingFab from "@/components/base-ui/Float";

import { useClubMeQuery } from "@/hooks/queries/useClubhomeQueries";
import { useClubNoticesQuery } from "@/hooks/queries/useClubNotificationQueries";

type NoticeTag = "general" | "vote" | "meeting";
type TagCode = "GENERAL" | "MEETING" | "VOTE" | "VOTE_MEETING";

export default function GroupNoticePage() {
  const params = useParams();
  const router = useRouter();

  const groupId = params.id as string;
  const clubId = Number(params.id);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);


  const meQuery = useClubMeQuery(clubId);

  const isAdmin = useMemo(() => {
    if (!Number.isFinite(clubId) || clubId <= 0) return false;
    if (!meQuery.isSuccess) return false; // ✅ 성공한 데이터만 신뢰
    const me = meQuery.data;
    if (!me) return false;
    if (typeof (me as any).staff === "boolean") return (me as any).staff;
    return (me as any).myStatus === "STAFF";
  }, [clubId, meQuery.isSuccess, meQuery.data]);

  // 2) 공지 목록 (페이지네이션)
  const noticesQuery = useClubNoticesQuery(clubId, currentPage);
  const data = noticesQuery.data;

  const pinnedNotices = data?.pinnedNotices ?? [];
  const notices = data?.normalNotices.notices ?? [];
  const totalPages = data?.normalNotices.totalPages ?? 1;

  const isEmpty = pinnedNotices.length === 0 && notices.length === 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  //tagItem.code 4종 정확 매핑
  const mapTags = (code?: string): readonly NoticeTag[] | undefined => {
    switch (code as TagCode) {
      case "GENERAL":
        return ["general"] as const;
      case "MEETING":
        return ["meeting"] as const;
      case "VOTE":
        return ["vote"] as const;
      case "VOTE_MEETING":
        return ["vote", "meeting"] as const;
      default:
        return undefined;
    }
  };

  const handleNoticeClick = (id: number) => {
    router.push(`/groups/${groupId}/notice/${id}`);
  };

  const handleAddNotice = () => {
    router.push(`/groups/${groupId}/admin/notice/new`);
  };

  return (
    <div className="w-full relative">
      {/* 비어있을 때 */}
      {isEmpty && (
        <div className="w-full min-h-[240px] flex items-center justify-center">
          <p className="body_1_2 text-Gray-4">공지사항이 없습니다.</p>
        </div>
      )}

      {/* 고정 공지 */}
      {pinnedNotices.length > 0 && (
        <div className="mb-3 flex flex-col gap-3">
          {pinnedNotices.map((notice) => (
            <NoticeItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              content={""}
              date={formatDate(notice.createdAt)}
              isPinned
              onClick={() => handleNoticeClick(notice.id)}
            />
          ))}
        </div>
      )}

      {/* 일반 공지 */}
      {notices.length > 0 && (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <NoticeItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              content={""}
              date={formatDate(notice.createdAt)}
              isPinned={false}
              tags={mapTags(notice.tagItem?.code)}
              onClick={() => handleNoticeClick(notice.id)}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 (비어있으면 숨김) */}
      {!isEmpty && (
        <div className="fixed bottom-20 left-0 right-0 t:bottom-24 d:bottom-4 d:left-50 py-4 flex items-center justify-center gap-0 z-50">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-Gray-4 hover:text-Gray-7 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="이전 페이지"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center body_1 cursor-pointer rounded-full transition-colors ${
                currentPage === page
                  ? "text-Gray-7 font-semibold"
                  : "text-Gray-4 hover:text-Gray-7"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-Gray-4 hover:text-Gray-7 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="다음 페이지"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 관리자일 때만 공지 작성 버튼 */}
      {isAdmin && (
        <FloatingFab
          iconSrc="/icons_pencil.svg"
          iconAlt="공지 작성"
          onClick={handleAddNotice}
        />
      )}
    </div>
  );
}