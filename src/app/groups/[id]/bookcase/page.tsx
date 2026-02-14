"use client";


import BookcaseCard from "@/components/base-ui/Bookcase/BookcaseCard";
import { useParams, useRouter } from "next/navigation";



// [1] 더미 데이터 생성 헬퍼 함수
const createMockBooks = (generation: string, count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${generation}-${i}`,
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
    books: createMockBooks("8기", 8),
  },
  {
    generation: "7기",
    books: createMockBooks("7기", 7),
  },
];

export default function BookcasePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const handleGoToDetail = (bookId: string) => {
    // 경로: /groups/[id]/admin/bookcase/[bookId]
    router.push(`/groups/${groupId}/bookcase/${bookId}`);
  };

  return (
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

          <div className="flex flex-wrap items-center gap-[10px] self-stretch justify-center d:justify-start">
            {group.books.map((book) => (
              <BookcaseCard
                key={book.id}
                title={book.title}
                author={book.author}
                imageUrl={book.imageUrl}
                category={book.category}
                rating={book.rating}
                // 이벤트 핸들러
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
