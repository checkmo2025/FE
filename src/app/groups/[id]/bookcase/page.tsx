"use client";

import React, { useEffect, useMemo, useRef } from "react";
import BookcaseCard from "@/components/base-ui/Bookcase/BookcaseCard";
import FloatingFab from "@/components/base-ui/Float";
import { BookcaseApiResponse } from "@/types/groups/bookcasehome";
import { useParams, useRouter } from "next/navigation";
import { useClubsBookshelfSimpleInfiniteQuery } from "@/hooks/queries/useClubsBookshelfQueries";

export default function BookcasePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.id);

  type TabParam = "topic" | "review" | "meeting";

  const handleGoToDetail = (meetingId: number, tab: TabParam) => {
    router.push(`/groups/${groupId}/bookcase/${meetingId}?tab=${tab}`);
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClubsBookshelfSimpleInfiniteQuery(groupId);

  const autoFetchCountRef = useRef(0);
  const AUTO_FETCH_LIMIT = 10;

  useEffect(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    if (autoFetchCountRef.current >= AUTO_FETCH_LIMIT) return;

    autoFetchCountRef.current += 1;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const mergedBookShelfInfoList = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.bookShelfInfoList ?? []);
  }, [data]);

  const isStaff = useMemo(() => {
    const first = data?.pages?.[0];
    return Boolean(first?.isStaff);
  }, [data]);

  const adaptedResponse: BookcaseApiResponse | null = useMemo(() => {
    if (!data?.pages?.length) return null;

    const first = data.pages[0];

    return {
      isSuccess: true,
      code: "COMMON200",
      message: "성공입니다.",
      result: {
        bookShelfInfoList: mergedBookShelfInfoList,
        hasNext: Boolean(first.hasNext),
        nextCursor: first.nextCursor == null ? null : String(first.nextCursor),
      },
    };
  }, [data, mergedBookShelfInfoList]);

  if (Number.isNaN(groupId)) {
    return (
      <div className="w-full flex flex-col gap-[24px] text-Gray-7 body_1_2">
        잘못된 모임 ID
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-[24px] text-Gray-7 body_1_2">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col gap-[24px] text-Gray-7 body_1_2">
        책장 조회 실패: {(error as Error)?.message ?? "unknown error"}
      </div>
    );
  }

  if (!adaptedResponse || mergedBookShelfInfoList.length === 0) {
    return (
      <div className="w-full flex flex-col gap-[24px] items-center h-50 justify-center">
        <div className="text-Gray-6 body_1_2">아직 책장이 없습니다.</div>

        {isStaff && (
          <FloatingFab
            iconSrc="/icons_pencil.svg"
            iconAlt="문의하기"
            onClick={() => router.push(`/groups/${groupId}/admin/bookcase/new`)}
          />
        )}
      </div>
    );
  }

  const list = adaptedResponse.result.bookShelfInfoList;

  return (
    <div
    className="
      w-full
      grid
      gap-[10px]
      justify-center
      justify-items-start
      [grid-template-columns:repeat(auto-fit,minmax(166px,166px))]
      t:[grid-template-columns:repeat(auto-fit,minmax(200px,200px))]
    "
  >
    {list.map((item) => {
      const meetingId = item.meetingInfo.meetingId;
      const bookId = item.bookInfo.bookId;

      return (
        <BookcaseCard
          key={`${meetingId}-${bookId}`}
          title={item.bookInfo.title}
          author={item.bookInfo.author}
          imageUrl={item.bookInfo.imgUrl ?? "/dummy_book_cover.png"}
          category={{
            generation: `${item.meetingInfo.generation}기`,
            genre: item.meetingInfo.tag,
          }}
          rating={item.meetingInfo.averageRate}
          onTopicClick={() => handleGoToDetail(meetingId, "topic")}
          onReviewClick={() => handleGoToDetail(meetingId, "review")}
          onMeetingClick={() => handleGoToDetail(meetingId, "meeting")}
        />
      );
    })}
     {isStaff && (
        <FloatingFab
          iconSrc="/icons_pencil.svg"
          iconAlt="문의하기"
          onClick={() => router.push(`/groups/${groupId}/admin/bookcase/new`)}
        />
      )}
  </div>
    );
}