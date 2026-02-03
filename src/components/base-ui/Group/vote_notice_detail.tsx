'use client';

import { useState } from 'react';
import Image from 'next/image';

type VoteOption = {
  id: number;
  text: string;
  count: number;
};

type VoteNoticeDetailProps = {
  title: string;
  content: string;
  date: string;
  isPinned?: boolean;
  tags?: readonly ('vote' | 'meeting')[];
  voteOptions: VoteOption[];
  voteEndDate: string;
  allowMultiple: boolean;
  isPublic: boolean;
  images?: string[];
};

export default function VoteNoticeDetail({
  title,
  content,
  date,
  isPinned = false,
  tags,
  voteOptions,
  voteEndDate,
  allowMultiple,
  isPublic,
  images,
}: VoteNoticeDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const handleOptionClick = (optionId: number) => {
    if (hasVoted) return;

    if (allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVoteSubmit = () => {
    if (selectedOptions.length === 0) return;
    setHasVoted(true);
    // TODO: API 호출
    console.log('투표 제출:', selectedOptions);
  };

  const handleRevote = () => {
    setHasVoted(false);
    setSelectedOptions([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="w-full">
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
        <h2 className="subhead_1 t:headline_3 text-Gray-7 flex-1">{title}</h2>
        <span className="body_1_2 text-Gray-4 shrink-0">{date}</span>
      </div>

      <div className="mb-6">
        <p className="body_1_3 t:subhead_4 text-Gray-5 whitespace-pre-wrap mb-4">
          {content}
        </p>

        {/* 이미지 */}
        {images && images.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-[100px] h-[140px] t:w-[216px] t:h-[216px] d:w-[400px] d:h-[400px] rounded-lg overflow-hidden"
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

        {/* 투표 */}
        <div className="flex items-center justify-between mb-4">
          <span className="body_1_2 text-Gray-4">
            투표종료 {formatDate(voteEndDate)}
          </span>
          <div className="flex items-center gap-3">
            {allowMultiple && (
              <div className="flex items-center gap-1">
                <span className="body_1_2 text-Gray-3">중복 가능</span>
                <Image
                  src="/duplicate.svg"
                  alt="중복 가능"
                  width={16}
                  height={16}
                />
              </div>
            )}
            {isPublic && (
              <div className="flex items-center gap-1">
                <span className="body_1_2 text-Gray-3">공개</span>
                <Image
                  src="/public.svg"
                  alt="공개"
                  width={16}
                  height={16}
                />
              </div>
            )}
          </div>
        </div>

        {/* 투표 옵션 */}
        <div className="flex flex-col gap-3 mb-6">
          {voteOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const isDisabled = hasVoted;

            return (
              <div
                key={option.id}
                onClick={() => !isDisabled && handleOptionClick(option.id)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors
                  ${
                    isSelected
                      ? 'border-primary-2 bg-Subbrown-4'
                      : 'border-Subbrown-3 bg-white hover:border-Subbrown-4'
                  }
                  ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}
                `}
              >
                <div
                  className={`
                    relative w-6 h-6 rounded-full border-2 shrink-0 bg-white
                    ${
                      isSelected
                        ? 'border-primary-2'
                        : 'border-Gray-3'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-2" />
                  )}
                </div>
                <span className="body_1_2 text-Gray-7 flex-1">
                  {option.id}번: {option.text}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Image
                    src="/member.svg"
                    alt="인원"
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <span className="body_1_2 text-Gray-5 w-3 text-right">{option.count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 투표하기/다시 투표 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={hasVoted ? handleRevote : handleVoteSubmit}
            disabled={!hasVoted && selectedOptions.length === 0}
            className={`
              w-[104px] h-[44px] px-6 py-3 rounded-lg body_1_2 transition-colors flex items-center justify-center box-border
              ${
                hasVoted
                  ? 'bg-Subbrown-4 border border-transparent text-primary-1 cursor-pointer hover:bg-Subbrown-3'
                  : selectedOptions.length > 0
                  ? 'bg-primary-1 text-white border border-transparent cursor-pointer hover:bg-primary-3 hover:text-white'
                  : 'bg-Gray-2 text-Gray-4 border border-transparent cursor-not-allowed'
              }
            `}
          >
            {hasVoted ? '다시 투표' : '투표하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
