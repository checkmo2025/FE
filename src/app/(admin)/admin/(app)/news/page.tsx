"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminSearchHeader from "@/components/layout/AdminSearchHeader";
import { fetchAdminNews } from "@/lib/api/admin/news";
import { formatDate } from "@/utils/date";

type NewsRow = {
  newsId: number;
  title: string;
  authorEmail: string;
  carousel: "프로모션" | "일반";
  createdAt: string;
  publishStartAt: string;
  publishEndAt: string;
};

export default function NewsPage() {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleKeywordChange = (v: string) => {
    setKeyword(v.slice(0, 40));
    setPage(1);
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(false);

        const apiPage = Math.max(0, page - 1);
        const data = await fetchAdminNews(apiPage, searchKeyword.trim());

        if (!data.isSuccess) {
          throw new Error(data.message || "관리자 소식 목록 조회 실패");
        }

        const rows: NewsRow[] = (data.result.basicInfoList ?? []).map((item) => ({
          newsId: item.newsId,
          title: item.title,
          authorEmail: item.requesterEmail,
          carousel: item.carousel === "PROMOTION" ? "프로모션" : "일반",
          createdAt: formatDate(item.createdAt),
          publishStartAt: formatDate(item.publishStartAt),
          publishEndAt: formatDate(item.publishEndAt),
        }));

        if (!alive) return;

        setNewsList(rows);
        setTotalPages(data.result.totalPages ?? 1);
      } catch (e) {
        console.error(e);
        if (!alive) return;

        setNewsList([]);
        setTotalPages(1);
        setError(true);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [page, searchKeyword]);

  const filtered = useMemo(() => {
    return newsList;
  }, [newsList]);

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword.trim());
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
      <div className="w-full max-w-[1040px] px-4 pt-6 pb-10 t:px-6 d:px-0">
        <AdminSearchHeader
          title="소식 관리"
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="검색 (소식 제목)"
          inputWidthClassName="flex-1"
          rightAddon={
            <Link
              href="/admin/news/new"
              className="flex h-12 w-full flex-shrink-0 items-center justify-center gap-2.5 rounded-[8px] bg-primary-1 px-4 py-3 text-White body_1_1 transition-colors hover:bg-primary-3 t:w-[187px]"
            >
              소식 등록
            </Link>
          }
        />

        <div className="w-full">
          <div className="-mx-4 overflow-x-auto px-4 t:-mx-6 t:px-6 d:mx-0 d:px-0">
          <table className="w-full min-w-[1040px] table-fixed">
            <colgroup>
              <col className="w-[100px]" />
              <col className="w-[190px]" />
              <col className="w-[180px]" />
              <col className="w-[100px]" />
              <col className="w-[150px]" />
              <col className="w-[200px]" />
              <col className="w-[120px]" />
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
                  캐러셀
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
              {error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center body_1_2 text-red-500"
                  >
                    {searchKeyword ? "검색 실패" : "소식 리스트 불러오기 실패"}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center body_1_2 text-Gray-4"
                  >
                    {searchKeyword ? "검색 결과가 없음" : "소식 리스트가 없습니다."}
                  </td>
                </tr>
              ) : (
                filtered.map((n) => (
                  <tr
                    key={n.newsId}
                    className="h-[48px] border-b border-Subbrown-4 body_1_2"
                  >
                    <td className="pl-[12px] py-0 text-Gray-7">{n.newsId}</td>
                    <td className="pl-[12px] py-0 text-Gray-7 truncate">
                      {n.title}
                    </td>
                    <td className="pl-[12px] py-0 text-Gray-7 truncate">
                      {n.authorEmail}
                    </td>
                    <td className="pl-[12px] py-0 text-Gray-7">
                      {n.carousel}
                    </td>
                    <td className="pl-[12px] py-0 text-Gray-7">{n.createdAt}</td>
                    <td className="pl-[12px] py-0 text-Gray-7">
                      <span className="inline-grid grid-cols-[82px_16px_82px] items-center tabular-nums">
                        <span className="text-right">{n.publishStartAt}</span>
                        <span className="text-center">~</span>
                        <span className="text-left">{n.publishEndAt}</span>
                      </span>
                    </td>
                    <td className="pl-[12px] py-0">
                      <Link
                        href={`/admin/news/${n.newsId}`}
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
          </div>

          {loading && (
            <div className="py-6 text-center body_1_2 text-Gray-4">
              로딩중...
            </div>
          )}

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
