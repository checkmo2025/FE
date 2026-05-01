"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { isValidUrl } from "@/utils/url";
import { useStoryDetailQuery } from "@/hooks/queries/useStoryQueries";
import { useUpdateBookStoryMutation } from "@/hooks/mutations/useStoryMutations";
import { useAuthStore } from "@/store/useAuthStore";
import BookstoryChoosebook from "@/components/base-ui/BookStory/Editor/bookstory_choosebook";

export default function StoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const bookStoryId = Number(id);

  const { data: story, isLoading, isError } = useStoryDetailQuery(bookStoryId);
  const { mutate: updateStory, isPending } = useUpdateBookStoryMutation();
  const { isLoggedIn, isInitialized } = useAuthStore();

  const [description, setDescription] = useState("");
  const [isDescriptionInitialized, setIsDescriptionInitialized] = useState(false);

  // 초기 description 세팅 (데이터 로드 후 한 번만)
  useEffect(() => {
    if (story && !isDescriptionInitialized) {
      setDescription(story.description);
      setIsDescriptionInitialized(true);
    }
  }, [story, isDescriptionInitialized]);

  // 로그인 여부 방어
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.replace("/stories");
    }
  }, [isInitialized, isLoggedIn, router]);

  // 본인 글 여부 방어
  useEffect(() => {
    if (story && !story.writtenByMe) {
      toast.error("수정 권한이 없습니다.");
      router.replace(`/stories/${bookStoryId}`);
    }
  }, [story, bookStoryId, router]);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error("내용을 입력해 주세요.");
      return;
    }

    updateStory(
      { bookStoryId, data: { description } },
      {
        onSuccess: () => {
          toast.success("수정이 완료되었습니다.");
          router.push(`/stories/${bookStoryId}`);
        },
        onError: () => {
          toast.error("수정에 실패했습니다. 다시 시도해 주세요.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2" />
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

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      {/* Breadcrumb - 모바일 */}
      <div className="t:hidden w-screen -mx-4 border-b border-zinc-300">
        <div className="px-4 h-[44px] flex gap-5 items-center">
          <div className="body_1 text-Gray-3">책이야기</div>
          <div className="relative w-[12px] h-[12px]">
            <Image src="/triangle.svg" alt="next" fill className="object-contain" />
          </div>
          <div className="body_1 text-Gray-7">수정하기</div>
        </div>
      </div>

      {/* Breadcrumb - 태블릿/데스크탑 */}
      <div className="hidden t:flex t:mt-6 h-[44px] gap-5 items-center border-b border-zinc-300">
        <div className="d:subhead_4_1 text-Gray-3">책이야기</div>
        <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
          <Image src="/triangle.svg" alt="next" fill className="object-contain" />
        </div>
        <div className="d:subhead_4_1 text-Gray-7">수정하기</div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="py-6 px-2.5 t:px-10">
        {/* 책 정보 (읽기 전용) */}
        <div className="flex justify-center mb-6">
          <BookstoryChoosebook
            bookUrl={isValidUrl(story.bookInfo.imgUrl) ? story.bookInfo.imgUrl : "/book_example.svg"}
            bookName={story.bookInfo.title}
            author={story.bookInfo.author}
            bookDetail=""
          />
        </div>

        {/* 제목 (읽기 전용) */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-[1040px]">
            <p className="body_1_2 text-Gray-4 mb-1">제목</p>
            <div className="w-full px-4 py-3 rounded-lg border border-Gray-2 bg-Gray-1 body_1_3 text-Gray-5 cursor-not-allowed">
              {story.bookStoryTitle}
            </div>
          </div>
        </div>

        {/* description 수정 영역 */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1040px]">
            <p className="body_1_2 text-Gray-4 mb-1">내용</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="책 이야기 내용을 입력해 주세요."
              className="w-full min-h-[300px] px-4 py-3 rounded-lg border border-Gray-2 bg-background body_1_3 text-Gray-7 resize-none focus:outline-none focus:border-primary-2 transition-colors"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-[1040px] justify-center t:justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg border border-primary-1 text-primary-3 body_1_2 bg-background transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg bg-primary-2 text-White body_1_2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
