"use client";

import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";

// [Mock Data] 실제로는 API로 불러올 데이터
const ADMIN_BOOKS = [
  {
    id: 1,
    title: "채식주의자",
    author: "한강 지음",
    imageUrl: "/dummy_book_cover.png",
    category: { generation: "7기", genre: "소설/시/희곡" },
    rating: 4.5,
    description:
      "책을 좋아하는 사람들이 모여 각자의 속도로 읽고, 각자의 언어로 생각을 나누는 책 모임입니다. 이 모임은 정답을 찾기보다 질문을 남기는 시간을 소중히 여기며, 한 권의 책을 통해 서로의 관점과 경험을 자연스럽게 공유하는 것을 목표로 합니다. 문학, 에세이, 인문 등 다양한 장르를 함께 읽으며 책 속 문장이 개인의 기억과 일상으로 확장되는 순간을 발견하고자 합니다. 발언의 부담 없이 듣는 것만으로도 충분하며, 말하고 싶을 때 편안하게 참여할 수 있는 분위기를 지향합니다. 책을 매개로 사유의 폭을 넓히고, 혼자 읽을 때는 지나쳤던 감정과 생각을 함께 천천히 짚어가는 모임입니다. 읽는 즐거움과 나누는 기쁨을 경험하고 싶은 분이라면 누구나 환영합니다. (← 이게 500자)",
  },
];

export default function AdminBookcasePage() {
  return (
    <div className="flex w-full flex-col gap-[40px] pb-[100px]">
      {/* 2. 도서 리스트  */}
      <div className="flex flex-col gap-[32px]">
        {ADMIN_BOOKS.map((book) => (
          <div key={book.id} className="flex flex-col gap-[16px]">
            {/* 방금 만든 상세 카드 컴포넌트 */}
            <BookDetailCard
              imageUrl={book.imageUrl}
              title={book.title}
              author={book.author}
              description={book.description}
              category={book.category}
              rating={book.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
