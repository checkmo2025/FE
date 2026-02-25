"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSearchHeader from "@/components/layout/AdminSearchHeader";

type NewsRow = {
  id: number;
  title: string;
  authorEmail: string;
  createdAt: string;
  postedAt: string;
};

export default function NewsPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  // 더미 데이터 (테스트용) - 100개 생성
  const newsList: NewsRow[] = useMemo(() => {
    const base = [
      { title: "서비스 업데이트 안내", authorEmail: "yh9839@naver.com" },
      { title: "이벤트 오픈 공지", authorEmail: "minsu@test.com" },
      { title: "점검 일정 안내", authorEmail: "jieun@test.com" },
      { title: "신규 기능 출시", authorEmail: "seoyeon@test.com" },
      { title: "운영 정책 변경", authorEmail: "daeun@test.com" },
    ];

    const toDate = (i: number, offsetDays = 0) => {
      const y = i % 2 === 0 ? 2025 : 2026;
      const m = y === 2025 ? 10 + (i % 3) : 1 + (i % 2);
      const d = 1 + ((i + offsetDays) % 28);
      return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
    };

    return Array.from({ length: 100 }).map((_, i) => {
      const b = base[i % base.length];
      const start = toDate(i, 0);
      const end = toDate(i, 7);

      return {
        id: 100 + i,
        title: `${b.title} ${i + 1}`,
        authorEmail: b.authorEmail,
        createdAt: toDate(i, 0),
        postedAt: `${start} - ${end}`,
      };
    });
  }, []);

  const pageSize = 20;

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return newsList;

    return newsList.filter((n) => {
      return (
        String(n.id).includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.authorEmail.toLowerCase().includes(q)
      );
    });
  }, [newsList, keyword]);

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
          title="소식 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 하기 (소식 제목)"
          inputWidthClassName="w-[1040px]"
          rightAddon={
            <button
              type="button"
              onClick={() => router.push("/admin/news/new")}
              className="flex-shrink-0 flex w-[187px] h-[48px] px-[16px] py-[12px] items-center justify-center gap-[10px] rounded-[8px] bg-[#7B6154] text-white text-[14px] font-semibold hover:opacity-90"
            >
              소식 등록
            </button>
          }
        />

        {/* 라인형 테이블 */}
        <div className="w-full">
          <table className="w-[1040px] table-fixed">
            <colgroup>
              <col className="w-[112px]" />
              <col className="w-[200px]" />
              <col className="w-[180px]" />
              <col className="w-[180px]" />
              <col className="w-[251px]" />
              <col className="w-[112px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-[#D2C5B6]">
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">소식 ID</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">소식 제목</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">등록자 이메일</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">등록 일자</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">게시날짜</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((n) => (
                <tr key={n.id} className="h-[48px] border-b border-[#EAE5E2] font-medium">
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{n.id}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{n.title}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{n.authorEmail}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{n.createdAt}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{n.postedAt}</td>
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