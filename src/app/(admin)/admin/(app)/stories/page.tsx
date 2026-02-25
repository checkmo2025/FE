"use client";

import { useMemo, useState } from "react";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";

type BookStoryRow = {
  id: number;
  title: string;
  authorEmail: string;
  bookTitle: string;
  postedAt: string;
  status: "등록" | "임시저장";
};

export default function BookStoriesPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  // 더미 데이터 (테스트용) - 100개 생성
  const stories: BookStoryRow[] = useMemo(() => {
    const base = [
      {
        title: "삶을 바꾸는 문장들",
        authorEmail: "yh9839@naver.com",
        bookTitle: "어린 왕자",
      },
      {
        title: "끝까지 읽게 되는 이유",
        authorEmail: "minsu@test.com",
        bookTitle: "데미안",
      },
      {
        title: "마음이 가벼워지는 독서",
        authorEmail: "jieun@test.com",
        bookTitle: "미움받을 용기",
      },
      {
        title: "기록하는 독서 습관",
        authorEmail: "seoyeon@test.com",
        bookTitle: "아토믹 해빗",
      },
      {
        title: "다시 시작하는 용기",
        authorEmail: "daeun@test.com",
        bookTitle: "나미야 잡화점의 기적",
      },
    ];

    const toDate = (i: number) => {
      const y = i % 2 === 0 ? 2025 : 2026;
      const m = y === 2025 ? 10 + (i % 3) : 1 + (i % 2);
      const d = 1 + (i % 28);
      return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
    };

    return Array.from({ length: 100 }).map((_, i) => {
      const b = base[i % base.length];
      return {
        id: 100 + i,
        title: `${b.title} ${i + 1}`,
        authorEmail: b.authorEmail,
        bookTitle: b.bookTitle,
        postedAt: toDate(i),
        status: i % 4 === 0 ? "임시저장" : "등록",
      };
    });
  }, []);

  const pageSize = 20;

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return stories;

    return stories.filter((s) => {
      return (
        String(s.id).includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.authorEmail.toLowerCase().includes(q) ||
        s.bookTitle.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
      );
    });
  }, [stories, keyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleSearch = () => {
    console.log("검색:", keyword);
    setPage(1);
  };

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  };

  const pageButtons = useMemo(() => {
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = start + max - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - max + 1);
    }
    return Array.from({ length: end - start + 1 }).map((_, idx) => start + idx);
  }, [page, totalPages]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1040px] pt-6 pb-10">
        <AdminSearchHeader
          title="책 이야기 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 하기 (책이야기 제목)"
          inputWidthClassName="w-[1040px]"
        />

        {/* 라인형 테이블 */}
        <div className="w-full">
          <table className="w-[1040px] table-fixed">
            <colgroup>
              <col className="w-[112px]" />
              <col className="w-[200px]" />
              <col className="w-[246px]" />
              <col className="w-[180px]" />
              <col className="w-[112px]" />
              <col className="w-[72px]" />
              <col className="w-[112px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-[#D2C5B6]">
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">책이야기 ID</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">책이야기 제목</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">등록자 이메일</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">책 제목</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">게시날짜</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">등록여부</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((s) => (
                <tr key={s.id} className="h-[48px] border-b border-[#EAE5E2] font-medium">
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{s.id}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{s.title}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{s.authorEmail}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{s.bookTitle}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{s.postedAt}</td>
                  <td className="py-0 text-[14px] text-[#2C2C2C] text-center">{s.status}</td>
                  <td className="pl-[12px] py-0">
                    <button className="text-[14px] text-[#2C2C2C] underline underline-offset-2">
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[12px] leading-[145%] tracking-[-0.012px]">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className={`flex items-center ${
                page === 1
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke={page === 1 ? "#8D8D8D" : "#2C2C2C"}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {pageButtons.map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`cursor-pointer ${
                  p === page ? "text-[#2C2C2C]" : "text-[#8B8B8D]"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className={`flex items-center ${
                page === totalPages
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke={page === totalPages ? "#8D8D8D" : "#2C2C2C"}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}