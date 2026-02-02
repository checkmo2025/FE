'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type NoticeDetailProps = {
  title: string;
  content: string;
  date: string;
  isPinned?: boolean;
  tags?: readonly ('vote' | 'meeting')[];
  images?: string[];
};

export default function NoticeDetail({
  title,
  content,
  date,
  isPinned = false,
  tags,
  images,
}: NoticeDetailProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* 고정 공지사항일 때 "일반" 표시 */}
      {isPinned && (
        <div className="mb-4">
          <span className="w-14 h-7 body_1_2 text-white bg-primary-2 px-3.5 py-1.5 rounded">일반</span>
        </div>
      )}

      {/* 해시태그 */}
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className={`w-13 h-7 rounded flex items-center justify-center px-2 py-1 text-white body_1_2 ${
                tag === 'vote' ? 'bg-Secondary-3' : 'bg-Secondary-2'
              }`}
            >
              {tag === 'vote' ? '투표' : '모임'}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <h2 className="subhead_2 t:headline_3 text-Gray-7 flex-1">{title}</h2>
        <span className="body_1_2 text-Gray-3 shrink-0">{date}</span>
        {/* 메뉴 */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-34 h-22 rounded-lg bg-White z-10 px-2 shadow-md">
              <button
                type="button"
                onClick={() => {
                  console.log('삭제하기');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image src="/delete.svg" alt="삭제" width={24} height={24} />
                삭제하기
              </button>
              <div className="mx-2 border-b border-Subbrown-4" />
              <button
                type="button"
                onClick={() => {
                  console.log('수정하기');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image
                  src="/edit2.svg"
                  alt="수정"
                  width={24}
                  height={24}
                />
                수정하기
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="body_1_3 t:subhead_4 text-Gray-5 whitespace-pre-wrap">
          {content}
        </p>
        
        {/* 이미지 영역 */}
        {images && images.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-25 h-35 t:w-56 t:h-56 d:w-100 d:h-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt={`이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
