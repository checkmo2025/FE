'use client';

import React from 'react';

function StarSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

type CommonProps = {
  value: number; // 0 ~ 5 (0.5 단위 가능)
  max?: number; // default 5
  className?: string;
  starClassName?: string; // 사이즈
};

// 표시용 (readonly)
export function StarRating({
  value,
  max = 5,
  className = '',
  starClassName = 'w-[16px] h-[16px] t:w-[18px] t:h-[18px] d:w-[20px] d:h-[20px]',
}: CommonProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const full = value >= i + 1;
    const half = !full && value >= i + 0.5;

    return (
      <div key={i} className={`relative shrink-0 ${starClassName}`}>
        {/* 바탕: 빈 별 */}
        <StarSvg className={`absolute inset-0 ${starClassName} text-Subbrown-3`} />

        {/* 반 별 */}
        {half && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarSvg className={`${starClassName} text-Secondary-2`} />
          </div>
        )}

        {/* 꽉 찬 별 */}
        {full && <StarSvg className={`absolute inset-0 ${starClassName} text-Secondary-2`} />}
      </div>
    );
  });

  return <div className={`flex items-center gap-1 ${className}`}>{stars}</div>;
}

type SelectorProps = CommonProps & {
  onChange: (next: number) => void;
  allowHalf?: boolean; // default true
};

// 선택용
export function StarSelector({
  value,
  onChange,
  max = 5,
  allowHalf = true,
  className = '',
  starClassName = 'w-[16px] h-[16px] t:w-[18px] t:h-[18px] d:w-[20px] d:h-[20px]',
}: SelectorProps) {
  const handlePick = (e: React.MouseEvent<HTMLButtonElement>, i: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const isHalf = allowHalf && x < rect.width / 2;
    const next = isHalf ? i + 0.5 : i + 1;

    onChange(next);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const full = value >= i + 1;
        const half = !full && value >= i + 0.5;

        return (
          <button
            key={i}
            type="button"
            onClick={(e) => handlePick(e, i)}
            className={`relative shrink-0 ${starClassName}`}
            aria-label={`${i + 1}점 선택`}
          >
            {/* 빈 별 */}
            <StarSvg className={`absolute inset-0 ${starClassName} text-Subbrown-3`} />

            {/* 반 별 */}
            {half && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <StarSvg className={`${starClassName} text-Secondary-2`} />
              </div>
            )}

            {/* 꽉 찬 별 */}
            {full && <StarSvg className={`absolute inset-0 ${starClassName} text-Secondary-2`} />}
          </button>
        );
      })}
    </div>
  );
}
