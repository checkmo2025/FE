"use client";

import { useEffect, useState } from "react";
import BookstoryDetail from "@/components/base-ui/Admin/stories/bookstory_detail";
import StoryNavigation from "@/components/base-ui/Admin/stories/story_navigation";
import CommentSection from "@/components/base-ui/Admin/stories/comment_section";
import Image from "next/image";
import { isValidUrl } from "@/utils/url";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import LoginModal from "@/components/base-ui/Login/LoginModal";
import { useToggleStoryLikeMutation } from "@/hooks/mutations/useStoryMutations";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import {
  fetchAdminBookStoryDetail,
  type AdminBookStoryDetail,
} from "@/lib/api/admin/stories";

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [story, setStory] = useState<AdminBookStoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { mutate: toggleLike } = useToggleStoryLikeMutation();
  const { mutate: toggleFollow } = useToggleFollowMutation();
  const { isLoggedIn, isLoginModalOpen, openLoginModal, closeLoginModal } =
    useAuthStore();

  useEffect(() => {
    if (Number.isNaN(id)) {
      router.push("/admin/stories");
      return;
    }

    const loadStory = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await fetchAdminBookStoryDetail(id);
        setStory(result);
      } catch (error) {
        console.error("책 이야기 상세 조회 실패:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [id, router]);

  const handleToggleLike = () => {
    if (!story) return;

    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    toggleLike(story.bookStoryId);
  };

  const handleToggleFollow = () => {
    if (!story) return;

    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    toggleFollow({
      nickname: story.authorInfo.nickname,
      isFollowing: story.authorInfo.following,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
      </div>
    );
  }

  if (!story || isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-Gray-7 mb-4">404</h2>
        <p className="text-Gray-5">해당 책 이야기를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const prevId = story.prevBookStoryId !== 0 ? story.prevBookStoryId : null;
  const nextId = story.nextBookStoryId !== 0 ? story.nextBookStoryId : null;

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      {isLoginModalOpen && <LoginModal onClose={() => closeLoginModal()} />}

      <div className="t:hidden w-screen -mx-4 border-b border-zinc-300">
        <div className="px-4 h-[44px] flex gap-5 items-center">
          <div className="body_1 text-Gray-3">책이야기</div>
          <div className="relative w-[12px] h-[12px]">
            <Image
              src="/triangle.svg"
              alt="next"
              fill
              className="object-contain"
            />
          </div>
          <div className="body_1 text-Gray-7">상세보기</div>
        </div>
      </div>

      <div className="hidden t:flex t:mt-6 h-[44px] gap-5 items-center border-b border-zinc-300">
        <div className="d:subhead_4_1 text-Gray-3">책이야기</div>
        <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
          <Image
            src="/triangle.svg"
            alt="next"
            fill
            className="object-contain"
          />
        </div>
        <div className="d:subhead_4_1 text-Gray-7">상세보기</div>
      </div>

      <div>
        <StoryNavigation
          currentId={story.bookStoryId}
          prevId={prevId}
          nextId={nextId}
        >
          <BookstoryDetail
            id={story.bookStoryId}
            imageUrl={
              isValidUrl(story.bookInfo.imgUrl)
                ? story.bookInfo.imgUrl
                : "/book_example.svg"
            }
            authorName={story.authorInfo.nickname}
            authorNickname={story.authorInfo.nickname}
            authorId={story.authorInfo.nickname}
            profileImgSrc={
              isValidUrl(story.authorInfo.profileImageUrl)
                ? story.authorInfo.profileImageUrl
                : "/profile2.svg"
            }
            bookTitle={story.bookInfo.title}
            bookAuthor={story.bookInfo.author}
            bookDetail={story.description}
            createdAt={story.createdAt}
            viewCount={story.viewCount}
            likeCount={story.likes}
            likedByMe={story.likedByMe}
            onLikeClick={handleToggleLike}
            subscribeText={story.authorInfo.following ? "구독중" : "구독"}
            isFollowing={story.authorInfo.following}
            onSubscribeClick={handleToggleFollow}
            hideSubscribeButton={story.writtenByMe}
          />
        </StoryNavigation>

        <div className="t:border-t-2 border-Gray-1 w-full max-w-[1040px] px-5 t:mx-auto t:mt-10 pt-6">
          <h2 className="subhead_1 t:headline_3 text-Gray-7">
            {story.bookStoryTitle}
          </h2>
          <p className="body_1_3 t:subhead_4 text-Gray-5 mt-4 whitespace-pre-wrap">
            {story.description}
          </p>
        </div>

        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-5 mt-10 pt-6 pb-10">
          <CommentSection
            storyId={story.bookStoryId}
            initialComments={story.comments}
            storyAuthorNickname={story.authorInfo.nickname}
          />
        </div>
      </div>
    </div>
  );
}