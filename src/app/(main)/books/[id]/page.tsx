"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";
import { useBookDetailQuery } from "@/hooks/queries/useBookQueries";
import { useToggleBookLikeMutation } from "@/hooks/mutations/useBookMutations";
import BookStoryInfiniteList from "@/components/base-ui/BookStory/Common/BookStoryInfiniteList";
import { useBookInfiniteStoriesQuery } from "@/hooks/queries/useStoryQueries";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { useAuthStore } from "@/store/useAuthStore";

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const isbn = params.id as string;
    const { data: bookData, isLoading, isError } = useBookDetailQuery(isbn);
    const { mutate: toggleBookLike } = useToggleBookLikeMutation();
    const { mutate: toggleStoryLike } = useToggleStoryLikeMutation();
    const { mutate: toggleFollow } = useToggleFollowMutation();
    const { isLoggedIn, openLoginModal } = useAuthStore();

    // 실제 책 이야기 데이터 연동
    const {
        data: storiesData,
        isLoading: isStoriesLoading,
        isError: isStoriesError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useBookInfiniteStoriesQuery(isbn);

    const relatedStories = useMemo(() => {
        if (!storiesData) return [];
        return storiesData.pages.flatMap((page) => page.basicInfoList) ?? [];
    }, [storiesData]);

    const handleToggleStoryLike = (storyId: number) => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        toggleStoryLike(storyId);
    };

    const handleToggleFollow = (nickname: string, isFollowing: boolean) => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        toggleFollow({ nickname, isFollowing });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white body_1">도서 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (isError || !bookData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-white body_1">도서 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-6 t:px-6 t:py-8">
            <div className="max-w-[1043px] mx-auto">
                <p className="text-Gray-7 body_1 t:subhead_1 mb-5">
                    도서 선택 <span className="text-primary-2">{bookData.title}</span> 중
                </p>

                {/* 선택한 책 카드 */}
                <div className="mb-14">
                    <SearchBookResult
                        imgUrl={bookData.imgUrl || "/booksample.svg"}
                        title={bookData.title}
                        author={bookData.author}
                        detail={bookData.description}
                        liked={bookData.likedByMe || false}
                        onLikeChange={() => {
                            if (!isLoggedIn) {
                                openLoginModal();
                                return;
                            }
                            toggleBookLike(isbn);
                        }}
                        onPencilClick={() => {
                            if (!isLoggedIn) {
                                openLoginModal();
                                return;
                            }
                            router.push(`/stories/new?isbn=${isbn}`);
                        }}
                    />
                </div>

                {/* 책이야기 */}
                <div className="mb-5">
                    <h2 className="text-Gray-7 body_1 t:subhead_1">
                        책이야기{" "}
                        <span className="text-primary-2">{relatedStories.length}</span>
                    </h2>
                </div>

                {/* 책 이야기 카드 */}
                <div className="w-full mt-4">
                    <BookStoryInfiniteList
                        stories={relatedStories}
                        isLoading={isStoriesLoading}
                        isError={isStoriesError}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        emptyMessage="해당 도서에 작성된 책 이야기가 없습니다."
                        errorMessage="책 이야기를 불러오는 중 오류가 발생했습니다."
                        cardLayoutType="large-fixed"
                        onToggleLike={handleToggleStoryLike}
                        onToggleFollow={handleToggleFollow}
                        onProfileClick={(nickname) => router.push(`/profile/${nickname}`)}
                    />
                </div>
            </div>
        </div>
    );
}
