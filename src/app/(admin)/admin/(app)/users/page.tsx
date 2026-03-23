"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";
import Link from "next/link";
import {
  fetchAdminMembers,
  type AdminMemberListItem,
} from "@/lib/api/admin/member";

export default function UsersPage() {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<AdminMemberListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword.trim());
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetchAdminMembers(page, searchKeyword);

        setUsers(res.result.memberList ?? []);
        setTotalPages(Math.max(1, res.result.totalPages ?? 1));
      } catch (error) {
        console.error("회원 목록 조회 실패:", error);
        setUsers([]);
        setTotalPages(1);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [page, searchKeyword]);

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
  const isSearching = searchKeyword.length > 0;

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
              {loading ? (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={5} className="pl-[12px] py-0 body_1_2 text-Gray-7">
                    불러오는 중...
                  </td>
                </tr>
              ) : error ? (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={5} className="pl-[12px] py-0 body_1_2 text-Gray-7">
                    {isSearching ? "검색 실패" : "멤버 리스트 불러오기 실패"}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.memberId}
                    className="h-[48px] border-b border-Subbrown-4 body_1_2"
                  >
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {u.memberId}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {u.name || u.nickname}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {u.email}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {u.phoneNumber}
                    </td>
                    <td className="pl-[12px] py-0">
                      <Link
                        href={`/admin/users/${u.nickname}`}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={5} className="pl-[12px] py-0 body_1_2 text-Gray-7">
                    {isSearching ? "검색 결과가 없음" : "멤버 리스트가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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