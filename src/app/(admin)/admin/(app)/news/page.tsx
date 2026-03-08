"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";
import { fetchAdminNews } from "@/lib/api/admin/news";

type NewsRow = {
  id: number;
  title: string;
  authorEmail: string;
  createdAt: string;
  postedAt: string;
};

export default function NewsPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  // API 호출: page 바뀔 때마다 새로 조회
  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);

        const apiPage = Math.max(0, page - 1); // UI(1-based) -> API(0-based)
        const data = await fetchAdminNews(apiPage);

        if (!data.isSuccess) {
          throw new Error(data.message || "관리자 소식 목록 조회 실패");
        }

        const rows: NewsRow[] = (data.result.basicInfoList ?? []).map((item) => ({
          id: item.newsId,
          title: item.title,
          authorEmail: item.requesterEmail,
          createdAt: item.createdAt,
          postedAt: `${item.publishStartAt} - ${item.publishEndAt}`,
        }));

        if (!alive) return;

        setNewsList(rows);
        setTotalPages(data.result.totalPages ?? 1);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setNewsList([]);
        setTotalPages(1);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [page]);

  /**
   * 검색 처리
   * - 현재 페이지 데이터 안에서만 필터링됨(서버 검색 아님)
   */
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

  const handleSearch = () => {
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
          title="소식 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 하기 (소식 제목)"
          inputWidthClassName="w-[1040px]"
          rightAddon={
            <Link
              href="/admin/news/new"
              className="flex-shrink-0 flex w-[187px] h-[48px] px-[16px] py-[12px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 text-White body_1_1 hover:opacity-90"
            >
              소식 등록
            </Link>
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
              <tr className="border-b border-Subbrown-3">
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  소식 ID
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  소식 제목
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  등록자 이메일
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  등록 일자
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  게시날짜
                </th>
                <th className="py-3 pl-[12px] text-left body_1_2 text-Gray-4">
                  상세보기
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((n) => (
                <tr
                  key={n.id}
                  className="h-[48px] border-b border-Subbrown-4 body_1_2"
                >
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">{n.id}</td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">
                    {n.title}
                  </td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7 truncate">
                    {n.authorEmail}
                  </td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                    {n.createdAt}
                  </td>
                  <td className="pl-[12px] py-0 body_1_2 text-Gray-7">
                    {n.postedAt}
                  </td>
                  <td className="pl-[12px] py-0">
                    <Link
                      href={`/admin/news/${n.id}`}
                      className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}

              {/* 빈 상태 */}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center body_1_2 text-Gray-4"
                  >
                    표시할 소식이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          {/* 로딩 표시 */}
          {loading ? (
            <div className="py-6 text-center body_1_2 text-Gray-4">로딩중...</div>
          ) : null}

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
              type="button"
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
                type="button"
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
              type="button"
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