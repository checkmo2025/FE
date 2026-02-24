"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function UsersPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // 더미 데이터 (테스트용) - 100명 생성
  const users: UserRow[] = useMemo(() => {
    const base = [
      { name: "윤현일", email: "yh9839@naver.com", phone: "010-1234-5678" },
      { name: "김민수", email: "minsu@test.com", phone: "010-2222-3333" },
      { name: "박지은", email: "jieun@test.com", phone: "010-4444-5555" },
      { name: "이서연", email: "seoyeon@test.com", phone: "010-7777-8888" },
      { name: "정다은", email: "daeun@test.com", phone: "010-9999-0000" },
    ];
    return Array.from({ length: 100 }).map((_, i) => {
      const b = base[i % base.length];
      const num = String(716 + i).padStart(4, "0");
      return {
        id: `hy_${num}`,
        name: b.name,
        email: b.email,
        phone: b.phone,
      };
    });
  }, []);

  const pageSize = 20;

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.id.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q)
      );
    });
  }, [users, keyword]);

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
          회원 관리
        </h1>

        <div className="relative mb-6 w-full">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="검색 하기 (아이디 또는 이메일)"
            className="w-[840px] h-[56px] rounded-[8px] border border-[#EAE5E2] bg-white pl-4 pr-14"
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
              <col className="w-[180px]" />
              <col className="w-[180px]" />
              <col className="w-[282px]" />
              <col className="w-[282px]" />
              <col className="w-[116px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-[#D2C5B6]">
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">ID</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">이름</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">이메일</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">전화번호</th>
                <th className="py-3 pl-[12px] text-left text-[14px] font-medium text-[#8B8B8B]">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((u) => (
                <tr key={u.id} className="h-[48px] border-b border-[#EAE5E2] font-medium">
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{u.id}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{u.name}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{u.email}</td>
                  <td className="pl-[12px] py-0 text-[14px] text-[#2C2C2C]">{u.phone}</td>
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