'use client';

import BookcaseCard from '@/components/base-ui/Bookcase/BookcaseCard';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookshelfModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1120px] h-[748px] rounded-[8px] bg-background p-10 shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 카드 그리드 */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
          <div className="grid grid-cols-3 t:grid-cols-4 d:grid-cols-5 gap-4">
            {/* 후에 실제 책장 데이터로 교체 */}
            {[...Array(15)].map((_, index) => (
              <div key={index} className="flex justify-center">
                <BookcaseCard
                  title={`책 제목 ${index + 1}`}
                  author="저자 이름"
                  category={{ generation: '7기', genre: '소설/시/희곡' }}
                  rating={4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
