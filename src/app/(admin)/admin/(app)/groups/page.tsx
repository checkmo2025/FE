"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";
import {
  fetchAdminClubs,
  type AdminClubListItem,
} from "@/lib/api/admin/clubs";

export default function GroupsPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [groups, setGroups] = useState<AdminClubListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 20;

  const loadGroups = async (targetPage: number) => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminClubs(targetPage - 1, pageSize);

      setGroups(data.clubs ?? []);
      setTotalPages(Math.max(1, data.totalPages ?? 1));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "모임 목록을 불러오지 못했습니다.",
      );
      setGroups([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups(page);
  }, [page]);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
  };

  const filteredGroups = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return groups;

    return groups.filter((g) => {
      return (
        String(g.clubId).includes(q) ||
        g.clubName.toLowerCase().includes(q) ||
        g.ownerEmail.toLowerCase().includes(q)
      );
    });
  }, [groups, keyword]);

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
              {loading ? (
                <tr className="h-[48px] border-b border-Subbrown-4">
                  <td
                    colSpan={6}
                    className="pl-[12px] py-0 body_1_2 text-Gray-7 text-center"
                  >
                    로딩 중...
                  </td>
                </tr>
              ) : error ? (
                <tr className="h-[48px] border-b border-Subbrown-4">
                  <td
                    colSpan={6}
                    className="pl-[12px] py-0 body_1_2 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredGroups.length === 0 ? (
                <tr className="h-[48px] border-b border-Subbrown-4">
                  <td
                    colSpan={6}
                    className="pl-[12px] py-0 body_1_2 text-Gray-7 text-center"
                  >
                    조회된 모임이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredGroups.map((g) => (
                  <tr
                    key={g.clubId}
                    className="h-[48px] border-b border-Subbrown-4 body_1_2"
                  >
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{g.clubId}</td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">
                      {g.clubName}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">
                      {g.ownerEmail}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {g.createdAt.slice(0, 10).replace(/-/g, ".")}
                    </td>
                    <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                      {g.memberCount}
                    </td>
                    <td className="pl-[12px] py-0">
                      <Link
                        href={`/admin/groups/${g.clubId}`}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))
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