"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchAdminClubActiveMembers,
  fetchAdminClubDetail,
  type AdminClubActiveMember,
} from "@/lib/api/admin/clubs";

type UserRow = {
  nickname: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  role: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mapRole(role: AdminClubActiveMember["role"]) {
  switch (role) {
    case "OWNER":
      return "개설자";
    case "ADMIN":
      return "운영진";
    case "MEMBER":
      return "회원";
    default:
      return role;
  }
}

export default function MembersListPage() {
  const params = useParams();
  const clubId = Number(params.id ?? params.clubId);

  const [page, setPage] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    if (!clubId || Number.isNaN(clubId)) return;

    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [clubDetail, membersResult] = await Promise.all([
          fetchAdminClubDetail(clubId),
          fetchAdminClubActiveMembers(clubId, page - 1, pageSize),
        ]);

        if (!mounted) return;

        setGroupName(clubDetail.name);

        const mappedUsers: UserRow[] = membersResult.members.map((member) => ({
          nickname: member.nickname,
          name: member.name,
          email: member.email,
          phone: member.phoneNumber,
          joinedAt: formatDate(member.joinedAt),
          role: mapRole(member.role),
        }));

        setUsers(mappedUsers);
        setTotalPages(Math.max(1, membersResult.totalPages));
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "모임 멤버 조회에 실패했습니다.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [clubId, page]);

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
        <h1 className="mb-6 text-[22px] font-semibold leading-[135%] tracking-[-0.022px] text-Gray-7">
          {groupName || "모임"}
        </h1>

        <div className="w-full">
          <table className="w-[1040px] table-fixed">
            <colgroup>
              <col className="w-[112px]" />
              <col className="w-[160px]" />
              <col className="w-[213px]" />
              <col className="w-[180px]" />
              <col className="w-[185px]" />
              <col className="w-[72px]" />
              <col className="w-[112px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-Subbrown-3">
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  닉네임
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  이름
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  이메일
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  전화번호
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  가입 일자
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  역할
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  상세보기
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={7} className="pl-[12px] text-Gray-7">
                    불러오는 중...
                  </td>
                </tr>
              ) : error ? (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={7} className="pl-[12px] text-Gray-7">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr className="h-[48px] border-b border-Subbrown-4 body_1_2">
                  <td colSpan={7} className="pl-[12px] text-Gray-7">
                    조회된 멤버가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={`${u.nickname}-${u.email}`}
                    className="h-[48px] border-b border-Subbrown-4 body_1_2"
                  >
                    <td className="pl-[12px] text-Gray-7">{u.nickname}</td>
                    <td className="pl-[12px] text-Gray-7">{u.name}</td>
                    <td className="pl-[12px] text-Gray-7">{u.email}</td>
                    <td className="pl-[12px] text-Gray-7">{u.phone}</td>
                    <td className="pl-[12px] text-Gray-7">{u.joinedAt}</td>
                    <td className="pl-[12px] text-Gray-7">{u.role}</td>
                    <td className="pl-[12px]">
                      <Link
                        href={`/admin/users/${u.nickname}`}
                        className="text-Gray-7 underline underline-offset-2 hover:opacity-70"
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
              disabled={isFirst || loading}
              className={`flex items-center ${
                isFirst || loading
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
              aria-label="이전 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke={isFirst || loading ? "var(--Gray_4)" : "var(--Gray_7)"}
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
                disabled={loading}
                className={`${
                  loading ? "cursor-default" : "cursor-pointer"
                } ${p === page ? "text-Gray-7" : "text-Gray-4"} hover:opacity-70`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goTo(page + 1)}
              disabled={isLast || loading}
              className={`flex items-center ${
                isLast || loading
                  ? "cursor-default opacity-30"
                  : "cursor-pointer hover:opacity-70"
              }`}
              aria-label="다음 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke={isLast || loading ? "var(--Gray_4)" : "var(--Gray_7)"}
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