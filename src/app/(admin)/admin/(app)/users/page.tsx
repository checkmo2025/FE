"use client";

import { useMemo, useState } from "react";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function UsersPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

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
          title="회원 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 하기 (아이디 또는 이메일)"
          inputWidthClassName="w-[1040px]"
        />

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
              <tr className="border-b border-Subbrown-3">
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">ID</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">이름</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">이메일</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">전화번호</th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">상세보기</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((u) => (
                <tr
                  key={u.id}
                  className="h-[48px] border-b border-Subbrown-4 body_1_2"
                >
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{u.id}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{u.name}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{u.email}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{u.phone}</td>
                  <td className="pl-[12px] py-0">
                    <button className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70">
                      상세보기
                    </button>
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