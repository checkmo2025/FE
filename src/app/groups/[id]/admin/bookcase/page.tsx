// src/app/groups/[id]/admin/bookcase/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import BookcaseCard from "@/components/base-ui/Bookcase/BookcaseCard";

// [1] 더미 데이터 생성 헬퍼 함수 (회원 페이지와 동일)
const createMockBooks = (generation: string, count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${generation}-${i}`, // 실제 DB 연동 시 bookId가 들어감
    title: "채식주의자",
    author: "한강 지음",
    imageUrl: "/dummy_book_cover.png",
    category: {
      generation: generation,
      genre: "소설/시/희곡",
    },
    rating: 4.5,
  }));

// [2] 기수별 데이터 그룹화
const BOOKCASE_DATA = [
  {
    generation: "8기",
    books: createMockBooks("8기", 4),
  },
  {
    generation: "7기",
    books: createMockBooks("7기", 8),
  },
];

export default function AdminBookcaseListPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  // [이동 로직] 도서 상세(운영진) 페이지로 이동
  const handleGoToDetail = (bookId: string) => {
    // 경로: /groups/[id]/admin/bookcase/[bookId]
    router.push(`/groups/${groupId}/admin/bookcase/${bookId}`);
  };

  return (
    // [UI] 회원 페이지와 동일한 레이아웃 구조
    <div className="w-full flex flex-col gap-[24px]">
      {/* 책장 리스트 영역 */}
      {BOOKCASE_DATA.map((group) => (
        <section
          key={group.generation}
          className="flex flex-col items-start gap-[8px] self-stretch"
        >
          {/* 기수 라벨 */}
          <div className="flex w-[112px] items-center gap-[10px] px-[12px] py-[10px]">
            <span className="text-Gray-4 body_1_2">{group.generation}</span>
          </div>

          {/* 카드 리스트 */}
          {/* 반응형 정렬: 모바일/태블릿(Center) -> 데스크탑(Start) */}
          <div className="flex flex-wrap items-center gap-[10px] self-stretch justify-center d:justify-start">
            {group.books.map((book) => (
              <BookcaseCard
                key={book.id}
                title={book.title}
                author={book.author}
                imageUrl={book.imageUrl}
                category={book.category}
                rating={book.rating}
                // [Click Event] 카드의 인터랙션 요소를 클릭하면 상세 페이지로 이동
                // BookcaseCard 컴포넌트 특성상 버튼별 핸들러가 나뉘어 있으므로 모두 상세 이동으로 연결
                onTopicClick={() => handleGoToDetail(book.id)}
                onReviewClick={() => handleGoToDetail(book.id)}
                onMeetingClick={() => handleGoToDetail(book.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
