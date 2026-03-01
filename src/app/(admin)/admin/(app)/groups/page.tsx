"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";

type GroupRow = {
  id: number;
  name: string;
  ownerEmail: string;
  createdAt: string;
  memberCount: number;
};

export default function GroupsPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  // 더미 데이터 (테스트용) - 100개 모임 생성
  const groups: GroupRow[] = useMemo(() => {
    const base = [
      { name: "러닝 크루", ownerEmail: "run@club.com" },
      { name: "독서 모임", ownerEmail: "book@club.com" },
      { name: "헬스 메이트", ownerEmail: "gym@club.com" },
      { name: "맛집 탐방", ownerEmail: "foodie@club.com" },
      { name: "여행 동행", ownerEmail: "trip@club.com" },
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
        name: `${b.name} ${i + 1}`,
        ownerEmail: b.ownerEmail,
        createdAt: toDate(i),
        memberCount: 5 + (i % 97), // 5~101
      };
    });
  }, []);

  const pageSize = 20;

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return groups;

    return groups.filter((g) => {
      return (
        String(g.id).includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.ownerEmail.toLowerCase().includes(q)
      );
    });
  }, [groups, keyword]);

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

  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1040px] pt-6 pb-10">
        <AdminSearchHeader
          title="모임 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 하기 (모임 명)"
          inputWidthClassName="w-[1040px]"
        />

        {/* 라인형 테이블 */}
        <div className="w-full">
          <table className="w-[1040px] table-fixed">
            <colgroup>
              <col className="w-[112px]" />
              <col className="w-[240px]" />
              <col className="w-[279px]" />
              <col className="w-[180px]" />
              <col className="w-[112px]" />
              <col className="w-[112px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-Subbrown-3">
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">모임 ID</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">이름</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">개설자 이메일</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">생성 일자</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">가입자 수</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((g) => (
                <tr
                  key={g.id}
                  className="h-[48px] border-b border-Subbrown-4 body_1_2"
                >
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{g.id}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">{g.name}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">{g.ownerEmail}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{g.createdAt}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{g.memberCount}</td>
                  <td className="pl-[12px] py-0">
                     <Link
                      href={`/admin/groups/${g.id}`}
                      className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="mt-6 flex items-center justify-center gap-4 body_2_2">
            <button
              onClick={() => goTo(page - 1)}
              disabled={isFirst}
              className={`flex items-center ${
                isFirst
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
              aria-label="이전 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke={isFirst ? "var(--Gray_4)" : "var(--Gray_7)"}
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
                  p === page ? "text-Gray-7" : "text-Gray-4"
                } hover:opacity-70`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goTo(page + 1)}
              disabled={isLast}
              className={`flex items-center ${
                isLast
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
              aria-label="다음 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke={isLast ? "var(--Gray_4)" : "var(--Gray_7)"}
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