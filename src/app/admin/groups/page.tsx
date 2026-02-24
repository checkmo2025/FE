"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

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

  // 검색어 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

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
        <h1 className="mb-[20px] text-[#2C2C2C] text-[22px] font-semibold leading-[135%] tracking-[-0.022px]">
          모임 관리
        </h1>

        <div className="relative mb-6 w-full">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="검색 하기 (모임 명)"
            className="w-[1040px] h-[56px] rounded-[8px] border border-[#EAE5E2] bg-white pl-4 pr-14"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100"
            aria-label="검색"
          >
            <Image src="/search.svg" alt="검색" width={24} height={24} />
          </button>
        </div>

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
              <tr className="border-b border-[#D2C5B6]">
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">모임 ID</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">이름</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">개설자 이메일</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">생성 일자</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">가입자 수</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((g) => (
                <tr key={g.id} className="h-[48px] border-b border-[#EAE5E2] font-medium">
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{g.id}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{g.name}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C] truncate">{g.ownerEmail}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{g.createdAt}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{g.memberCount}</td>
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
                  p === page ? "text-[#2C2C2C]" : "text-[#8D8D8D]"
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