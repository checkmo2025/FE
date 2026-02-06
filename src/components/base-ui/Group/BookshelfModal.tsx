'use client';

import BookcaseCard from '@/components/base-ui/Bookcase/BookcaseCard';
import Image from 'next/image';

type Book = {
  id: number;
  title: string;
  author: string;
  category: {
    generation: string;
    genre: string;
  };
  rating: number;
  description: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (book: Book) => void;
};

export default function BookshelfModal({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;

  // 더미 데이터
  const books: Book[] = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    title: `책 제목 ${index + 1}`,
    author: '저자 이름',
    category: { generation: '7기', genre: '소설/시/희곡' },
    rating: 4,
    description: '책을 좋아하는 사람들이 모여 각자의 속도로 읽고, 각자의 언어로 생각을 나누는 책 모임입니다. 다양한 관점에서 책을 읽고 토론하며 함께 성장해나갑니다.',
  }));

  const handleCardClick = (book: Book) => {
    onSelect?.(book);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1120px] h-[748px] rounded-[8px] bg-background p-10 shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <p className="subhead_4_1 text-Gray-7">책장 등록</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
            <Image
              src="/light_close.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 카드 그리드 */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
          <div className="grid grid-cols-3 t:grid-cols-4 d:grid-cols-5 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex justify-center cursor-pointer"
                onClick={() => handleCardClick(book)}
              >
                <BookcaseCard
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  rating={book.rating}
                  onTopicClick={() => {}}
                  onReviewClick={() => {}}
                  onMeetingClick={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
