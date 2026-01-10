import React from 'react';
import Image from 'next/image';

type BookstoryChoosebookProps = {
  bookUrl: string;
  bookName: string;
  author: string;
  bookDetail: string;
  onButtonClick?: () => void;
  className?: string;
};

export default function BookstoryChoosebook({
  bookUrl,
  bookName,
  author,
  bookDetail,
  onButtonClick,
  className = '',
}: BookstoryChoosebookProps) {
  return (
    <div
      className={`w-full max-w-[1040px] flex items-center p-[20px] ${className} bg-White border border-Subbrown-4 rounded-[8px]`}
    >
      {/* 왼쪽: 책 + 텍스트 */}
      <div className="flex items-start gap-[24px] min-w-0 flex-1">
        {/* Book Image */}
        <div className="relative w-[100px] h-[145px] shrink-0">
          <Image
            src={bookUrl}
            alt={bookName}
            fill
            className="object-cover rounded-[4px]"
            sizes="100px"
          />
        </div>

        {/* Texts */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* 제목/저자) */}
          <div className="flex flex-col min-w-0">
            <p className="text-[#000] subhead_3 truncate">{bookName}</p>
            <p className="text-[#757575] subhead_4_1 truncate">{author}</p>
          </div>

          {/* detail (넘치면 ... ) */}
          <p className="mt-[12px] text-Gray-4 body_1_2 line-clamp-4 overflow-hidden">
            {bookDetail}
          </p>
        </div>
      </div>

      {/* 버튼과 고정 gap 52 */}
      <div className="shrink-0 ml-[52px] self-stretch flex items-end">
        <button
          type="button"
          onClick={onButtonClick}
          className="
              flex w-[132px] h-[44px]
              px-[16px] py-[12px]
              justify-center items-center gap-[10px]
              rounded-[8px]
              border border-primary-2
              bg-background
              text-primary-2
              body_1_2
              whitespace-nowrap
            "
        >
          변경하기
        </button>
      </div>
    </div>
  );
}
