"use client";

import React, { useEffect, useMemo } from "react";
import LibraryCard from "./items/LibraryCard";
import { useLikedBooksInfiniteQuery } from "@/hooks/queries/useBookQueries";
import { useInView } from "react-intersection-observer";

const LibraryList = ({ nickname }: { nickname?: string }) => {
  const isMyLibrary = !nickname;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useLikedBooksInfiniteQuery(nickname);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const books = useMemo(() => {
    return data?.pages.flatMap((page) => page.books) || [];
  }, [data]);

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">{isMyLibrary ? "내 서재를 불러오는 중..." : "서재를 불러오는 중..."}</div>;
  }

  if (books.length === 0) {
    return <div className="py-10 text-center text-gray-500">{isMyLibrary ? "내 서재가 비어있습니다." : "서재가 비어있습니다."}</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-[1048px] mx-auto items-center">
      <div
        className="flex flex-wrap gap-[12px] t:gap-[20px] justify-center md:justify-start"
      >
        {books.map((book) => (
          <LibraryCard
            key={book.isbn}
            book={book}
          />
        ))}
      </div>
      <div ref={ref} className="h-10 mt-4 flex items-center justify-center">
        {isFetchingNextPage && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>}
      </div>
    </div>
  );
};

export default LibraryList;
