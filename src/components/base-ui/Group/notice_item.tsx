'use client';

import Image from 'next/image';

type NoticeItemProps = {
  id?: number;
  title: string;
  content: string;
  date: string;
  isPinned?: boolean;
  tags?: readonly ('vote' | 'meeting')[];
  onClick?: () => void;
  className?: string;
};

export default function NoticeItem({
  id,
  title,
  content,
  date,
  isPinned = false,
  tags,
  onClick,
  className = '',
}: NoticeItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full t:w-full d:w-[1039px] h-[48px] border border-Subbrown-3 rounded-lg cursor-pointer
        ${isPinned ? 'bg-Subbrown-4' : 'bg-white'}
        ${className}
      `}
    >
      <div className="w-full h-full px-2 flex items-center gap-3">
        {isPinned && (
          <div className="relative w-10 h-8 shrink-0 bg-primary-1 rounded-[4px] flex items-center justify-center p-1">
            <div className="relative w-6 h-6">
              <Image
                src="/quill_pin.svg"
                alt="고정"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
        {!isPinned && tags && tags.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
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
        <h3 className={`${isPinned ? 'text-Gray-7' : 'text-Gray-6'}  body_1_2  truncate flex-1`}>
          {title}
        </h3>
      </div>
    </div>
  );
}
