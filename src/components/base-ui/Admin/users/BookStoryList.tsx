"use client";

import React, { useEffect, useState } from "react";
import BookStoryCard from "./items/AdminBookStoryCard";
import { useInView } from "react-intersection-observer";
import {
  fetchAdminMemberBookStories,
  type AdminMemberBookStoryItem,
} from "@/lib/api/admin/member";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

const BookStoryList = ({ memberNickname }: Props) => {
  const [stories, setStories] = useState<AdminMemberBookStoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { ref, inView } = useInView();

  useEffect(() => {
    const loadInitialStories = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetchAdminMemberBookStories(memberNickname, null);

        setStories(res.result.basicInfoList ?? []);
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        console.error("회원 책이야기 조회 실패:", error);
        setStories([]);
        setHasNext(false);
        setNextCursor(null);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialStories();
  }, [memberNickname]);

  useEffect(() => {
    const loadMoreStories = async () => {
      if (!inView || !hasNext || nextCursor === null || isFetchingNextPage) {
        return;
      }

      try {
        setIsFetchingNextPage(true);

        const res = await fetchAdminMemberBookStories(
          memberNickname,
          nextCursor
        );

        setStories((prev) => [...prev, ...(res.result.basicInfoList ?? [])]);
        setHasNext(res.result.hasNext ?? false);
        setNextCursor(res.result.nextCursor ?? null);
      } catch (error) {
        console.error("회원 책이야기 추가 조회 실패:", error);
      } finally {
        setIsFetchingNextPage(false);
      }
    };

    loadMoreStories();
  }, [inView, hasNext, nextCursor, isFetchingNextPage, memberNickname]);

  return (
    <div className="flex flex-col items-center w-full max-w-[1048px] mx-auto gap-[20px] px-[18px] md:px-[40px] lg:px-0">
      {isLoading && (
        <p className="text-Gray-4 text-center py-4">로딩 중...</p>
      )}

      {!isLoading && isError && (
        <p className="text-red-500 text-center py-4">
          책 이야기를 불러오는 데 실패했습니다.
        </p>
      )}

      {!isLoading && !isError && stories.length === 0 && (
        <p className="text-Gray-4 text-center py-4">
          작성한 책 이야기가 없습니다.
        </p>
      )}

      {!isLoading && !isError && stories.length > 0 && (
        <div className="grid grid-cols-2 min-[540px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[12px] lg:gap-[20px] w-fit">
          {stories.map((story) => (
            <BookStoryCard
              key={story.bookStoryId}
              authorName={story.authorInfo.nickname}
              createdAt={story.createdAt}
              viewCount={story.viewCount}
              title={story.bookStoryTitle}
              content={story.description}
              likeCount={story.likes}
              commentCount={story.commentCount}
              coverImgSrc={story.bookInfo.imgUrl}
              profileImgSrc={story.authorInfo.profileImageUrl}
              hideSubscribeButton={true}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && hasNext && <div ref={ref} className="h-4 w-full" />}

      {isFetchingNextPage && (
        <p className="text-Gray-4 text-center py-4">
          추가 이야기를 불러오는 중...
        </p>
      )}
    </div>
  );
};

export default BookStoryList;