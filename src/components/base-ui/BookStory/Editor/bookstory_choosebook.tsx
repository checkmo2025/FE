import React from 'react';
import Image from 'next/image';

type BookstoryChoosebookProps = {
  bookUrl: string;
  bookName: string;
  author: string;
  bookDetail: string;
  className?: string;

  onButtonClick?: () => void;
};

export default function BookstoryChoosebook({
  bookUrl,
  bookName,
  author,
  bookDetail,
  className = '',
  onButtonClick,
}: BookstoryChoosebookProps) {
  const clickable = !!onButtonClick

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onButtonClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onButtonClick?.();
            }
          : undefined
      }
      className={`w-full max-w-[1040px] flex flex-col t:flex-row t:items-center p-[20px] ${className} bg-White border border-Subbrown-4 rounded-[8px] ${
        clickable ? 'cursor-pointer' : ''
      }`}
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
            <p className="text-[#000] subhead_3 t:truncate">{bookName}</p>
            <p className="text-[#757575] subhead_4_1 t:truncate">{author}</p>
          </div>

          {/* detail (넘치면 ... ) */}
          <p className="mt-[12px] text-Gray-4 body_1_2 line-clamp-4 overflow-hidden">
            {bookDetail}
          </p>
        </div>
      </div>

      {/* 모바일: 아래줄 가운데, 태블릿부터: 오른쪽 */}
      <div className="shrink-0 t:ml-[52px] t:self-stretch t:flex t:items-end mt-4 t:mt-0 flex justify-center">
        {/* 비워둠 (기존 UI 유지) */}
      </div>
    </div>
  );
}