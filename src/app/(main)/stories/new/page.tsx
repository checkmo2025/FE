"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BookstoryText from "@/components/base-ui/BookStory/bookstory_text";
import BookstoryChoosebook from "@/components/base-ui/BookStory/bookstory_choosebook";
import BookSelectModal from "@/components/layout/BookSelectModal";

function StoryNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isBookSelectModalOpen, setIsBookSelectModalOpen] = useState(false);

  // 더미 데이터 
  const selectedBook = bookId
    ? {
        id: Number(bookId),
        imgUrl: "/booksample.svg",
        title: "어린 왕자",
        author: "김개미, 연수",
        detail: "최대 500(넘어가면...으로)",
      }
    : null;

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    // TODO: 실제 저장 로직 구현
    console.log("저장:", { title, detail });
    router.push("/stories");
  };

  const handleBookSelect = (selectedBookId: number) => {
    router.push(`/stories/new?bookId=${selectedBookId}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-4">
      {/* 책이야기 > 글 작성하기 - 모달 열리면 숨김 */}
      {!isBookSelectModalOpen && (
        <>
          {/* 모바일: 전체 너비 선 */}
          <div className="t:hidden w-screen -mx-4 border-b border-zinc-300">
            <div className="px-4 h-[44px] flex gap-5 items-center">
              <div className="body_1 text-Gray-3">전체</div>
              <div className="relative w-[12px] h-[12px]">
                <Image
                  src="/triangle.svg"
                  alt="next"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="body_1 text-Gray-7">글 작성하기</div>
            </div>
          </div>
          {/* 태블릿/데스크탑: max-w 안에서 선 */}
          <div className="hidden t:flex t:mt-6 h-[44px] gap-5 items-center border-b border-zinc-300">
            <div className="d:subhead_4_1 text-Gray-3">전체</div>
            <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
              <Image
                src="/triangle.svg"
                alt="next"
                fill
                className="object-contain"
              />
            </div>
            <div className="d:subhead_4_1 text-Gray-7">글 작성하기</div>
          </div>
        </>
      )}
      {/* 메인 콘텐츠 영역 */}
      <div className="py-6 px-2.5 t:px-10">
        {/* 책 선택하기 박스 */}
        <div className="flex justify-center mb-6">
          {selectedBook ? (
            <BookstoryChoosebook
              bookUrl={selectedBook.imgUrl}
              bookName={selectedBook.title}
              author={selectedBook.author}
              bookDetail={selectedBook.detail}
              onButtonClick={() => {
                setIsBookSelectModalOpen(true);
              }}
            />
          ) : (
            <div className="flex w-full max-w-[1040px] p-5 justify-center items-center rounded-lg bg-White border-2 border-Subbrown-4">
              <button
                type="button"
                onClick={() => setIsBookSelectModalOpen(true)}
                className="flex px-6 py-2 justify-center items-center rounded-lg border border-primary-2 text-primary-2 body_1_2 bg-background cursor-pointer"
              >
                책 선택하기
              </button>
            </div>
          )}
        </div>

        {/* 글 작성 영역 */}
        <div className="flex justify-center">
          <BookstoryText
            title={title}
            detail={detail}
            onChangeTitle={setTitle}
            onChangeDetail={setDetail}
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-[1040px] justify-center t:justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg border border-primary-1 text-primary-3 body_1_2 bg-background transition-colors"
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg bg-primary-2 text-White body_1_2 hover:opacity-90 transition-opacity"
            >
              등록
            </button>
          </div>
        </div>
      </div>

      {/* 책 선택 모달 */}
      <BookSelectModal
        isOpen={isBookSelectModalOpen}
        onClose={() => setIsBookSelectModalOpen(false)}
        onSelect={handleBookSelect}
      />
    </div>
  );
}

export default function NewStoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryNewContent />
    </Suspense>
  );
}
