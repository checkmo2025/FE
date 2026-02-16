"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import NoticeItem from "@/components/base-ui/Group/notice_item";

export default function GroupNoticePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  // TODO: 실제 관리자 여부는 API로 확인
  const isAdmin = true; // true: 관리자, false: 일반회원

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // 더미 데이터
  const pinnedNotices = [
    {
      id: 1,
      title: "긁적긁적 독서 모임 공지사항",
      content: "이번 주 모임은 정상적으로 진행됩니다. 많은 참여 부탁드립니다.",
      date: "2025.01.15",
    },
    {
      id: 2,
      title: "새로운 책 추천 받습니다",
      content:
        "이번 달 읽을 책을 추천해주세요. 추천하신 책 중에서 선정하겠습니다.",
      date: "2025.01.10",
    },
  ];

  const notices = [
    {
      id: 3,
      title: "1월 독서 후기 공유",
      content: "1월에 읽으신 책들의 후기를 공유해주세요.",
      date: "2025.01.05",
      tags: ["vote"] as const,
    },
    {
      id: 4,
      title: "모임 장소 변경 안내",
      content: "다음 모임부터 장소가 변경됩니다. 자세한 내용은 확인해주세요.",
      date: "2024.12.28",
      tags: ["vote", "meeting"] as const,
    },
    {
      id: 5,
      title: "연말 모임 안내",
      content: "연말 특별 모임을 준비했습니다. 많은 참여 부탁드립니다.",
      date: "2024.12.20",
      tags: ["meeting"] as const,
    },
  ];

  const handleNoticeClick = (id: number) => {
    router.push(`/groups/${groupId}/notice/${id}`);
  };

  const handleAddNotice = () => {
    router.push(`/groups/${groupId}/admin/notice/new`);
  };

  return (
    <div className="w-full relative">
      {/* 고정 공지사항 */}
      {pinnedNotices.length > 0 && (
        <div className="mb-3 flex flex-col gap-3">
          {pinnedNotices.map((notice) => (
            <NoticeItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              content={notice.content}
              date={notice.date}
              isPinned={true}
              onClick={() => handleNoticeClick(notice.id!)}
            />
          ))}
        </div>
      )}

      {/* 일반 공지사항 */}
      <div className="flex flex-col gap-3">
        {notices.map((notice) => (
          <NoticeItem
            key={notice.id}
            id={notice.id}
            title={notice.title}
            content={notice.content}
            date={notice.date}
            isPinned={false}
            tags={notice.tags}
            onClick={() => handleNoticeClick(notice.id!)}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="fixed bottom-4 left-[200px] right-0 py-4 flex items-center justify-center gap-0 z-50">
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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

      {/* 관리자일 때만 공지사항 작성 버튼 표시 */}
      {isAdmin && (
        <button
          onClick={handleAddNotice}
          className="fixed bottom-21 right-4 t:bottom-8 t:right-8 z-[60] cursor-pointer hover:opacity-80 transition-opacity w-18 h-18 t:w-22 t:h-22"
          aria-label="공지사항 작성"
        >
          <Image
            src="/add_story.svg"
            alt="공지사항 작성"
            width={88}
            height={88}
            className="w-full h-full"
          />
        </button>
      )}
    </div>
  );
}
