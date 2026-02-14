'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type Category =
  | '전체'
  | '대학생'
  | '직장인'
  | '온라인'
  | '동아리'
  | '모임'
  | '대면';

const CATEGORY_OPTIONS: Category[] = [
  '전체',
  '대학생',
  '직장인',
  '온라인',
  '동아리',
  '모임',
  '대면',
];

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;

  category: Category;
  setCategory: (v: Category) => void;
  group: boolean;
  setGroup: (v: boolean) => void;
  region: boolean;
  setRegion: (v: boolean) => void;
};

export default function SearchGroupSearch({
  value,
  onChange,
  onSubmit,
  category,
  setCategory,
  group,
  setGroup,
  region,
  setRegion,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // 바깥 클릭하면 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const onPickCategory = (c: Category) => {
    setCategory(c);
    setOpen(false);
  };


  return (
    <div className="w-full">
      {/* 검색 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className={[
          'w-full h-[44px] t:h-[56px]',
          'flex items-center gap-[10px]',
          'px-4 py-3',
          'rounded-[8px]',
          'border border-Subbrown-4 bg-White',
        ].join(' ')}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="검색하기 (모임명, 지역별)"
          className={[
            'flex-1 min-w-0 bg-transparent outline-none',
            'body_1_3 t:subhead_4_1',
            'placeholder:text-Gray-3 text-Gray-7',
          ].join(' ')}
        />
        <button type="submit" className="shrink-0">
          <Image src="/search.svg" alt="검색" width={24} height={24} />
        </button>
      </form>

      {/* 필터 바 */}
      <div className="flex items-center gap-6 mt-4 body_1_3 t:subhead_4_1 text-Gray-7 ml-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[4px]"
            aria-expanded={open}
          >
            <span>{category}</span>
            <Image
              src={open ? '/ArrowTop.svg' : '/ArrowDown.svg'}
              alt="열기"
              width={24}
              height={24}
            />
          </button>

          {/* 드롭다운 메뉴: 아래로 덮어서 뜸 */}
          <div
            className={[
              'absolute left-0 top-[calc(100%+8px)] z-50',
              'min-w-[160px]',
              'rounded-[8px] border border-Subbrown-4 bg-White',
              'shadow-sm',
              'overflow-hidden',
              'transition-all duration-150',
              open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none',
            ].join(' ')}
          >
            {CATEGORY_OPTIONS.map((c) => {
              const selected = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onPickCategory(c)}
                  className={[
                    'w-full text-left',
                    'px-4 py-3',
                    'body_1_3 t:subhead_4_1',
                    selected ? 'bg-Subbrown-4 text-Gray-7' : 'bg-White text-Gray-7',
                    'hover:bg-Subbrown-4',
                  ].join(' ')}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 t:gap-6">
          <button
            type="button"
            onClick={() => setGroup(!group)}
            className="flex items-center gap-2 t:gap-3"
            aria-pressed={group}
          >
            <Image
              src={group ? '/RadioOn.svg' : '/RadioOff.svg'}
              alt=""
              width={20}
              height={20}
            />
            <span>모임별</span>
          </button>

          <button
            type="button"
            onClick={() => setRegion(!region)}
            className="flex items-center gap-2 t:gap-3"
            aria-pressed={region}
          >
            <Image
              src={region ? '/RadioOn.svg' : '/RadioOff.svg'}
              alt=""
              width={20}
              height={20}
            />
            <span>지역별</span>
          </button>
        </div>
      </div>
    </div>
  );
}
