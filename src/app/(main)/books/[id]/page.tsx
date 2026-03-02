"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBookResult from "@/components/base-ui/Search/search_bookresult";
import { DUMMY_STORIES } from "@/data/dummyStories";
import BookStoryCardLarge from "@/components/base-ui/BookStory/bookstory_card_large";
import { useBookDetailQuery } from "@/hooks/queries/useBookQueries";
import { useToggleBookLikeMutation } from "@/hooks/mutations/useBookMutations";

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const isbn = params.id as string;
    const { data: bookData, isLoading, isError } = useBookDetailQuery(isbn);
    const { mutate: toggleLike } = useToggleBookLikeMutation();

    // 관련된 책 이야기들 (더미 데이터에서 필터링)
    const relatedStories = useMemo(() => {
        if (!bookData) return [];
        return DUMMY_STORIES.filter((story) => story.bookTitle === bookData.title);
    }, [bookData]);

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
                        onLikeChange={() => toggleLike(isbn)}
                        onPencilClick={() => {
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
                <div className="grid grid-cols-1 t:grid-cols-2 d:grid-cols-3 gap-5 justify-items-center">
                    {relatedStories.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => router.push(`/stories/${story.id}`)}
                            className="cursor-pointer"
                        >
                            <BookStoryCardLarge
                                id={story.id}
                                authorName={story.authorName}
                                createdAt={story.createdAt}
                                viewCount={story.viewCount}
                                coverImgSrc={story.bookImageUrl}
                                title={story.title}
                                content={story.content}
                                likeCount={story.likeCount}
                                commentCount={story.commentCount}
                                subscribeText="구독"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
