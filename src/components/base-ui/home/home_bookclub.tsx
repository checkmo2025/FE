import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';
import { MyClubInfo } from '@/types/club';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

type Props = {
  groups: MyClubInfo[];
};

export default function HomeBookclub({ groups }: Props) {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuthStore();
  const count = groups.length;
  const isMany = count >= 5;

  const [open, setOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => {
    if (open) setOpen(false);
  });

  const handleCreateGroup = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push('/groups/create');
  };

  const handleSearchGroup = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push('/groups');
  };

  // 접힘: 6개만 / 펼침: 전체
  const displayGroups = isMany && !open ? groups.slice(0, 6) : groups;

  return (
    <div className="relative w-[165px] t:w-[332px] h-[215px] t:h-[424px]">
      <aside
        ref={containerRef}
        className={[
          'flex flex-col w-full pt-[40px] px-5 pb-5 t:p-5 rounded-[8px] bg-Subbrown-4 transition-all duration-300 z-50',
          open
            ? 'absolute top-0 left-0 h-auto max-h-[500px] t:max-h-[814px] shadow-2xl border border-Subbrown-3 opacity-100'
            : 'h-full overflow-hidden'
        ].join(' ')}
      >
        {/* 0개 */}
        {count === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="logo2.svg" alt="로고" className="mx-auto mb-4" />
          </div>
        )}

        {/* 리스트 */}
        {count > 0 && (
          <div
            className={[
              "flex flex-col gap-2",
              open ? "flex-1 overflow-y-auto no-scrollbar pb-2" : "",
            ].join(" ")}
          >
            {displayGroups.map((group) => (
              <div
                key={group.clubId}
                onClick={() => router.push(`/groups/${group.clubId}`)}
                className="flex w-full h-[52px] py-3 px-4 items-center rounded-lg bg-white shrink-0 cursor-pointer hover:brightness-98 hover:-translate-y-[1px] transition-all"
              >
                <span className="text-Gray-7 h-6 subhead_4_1 truncate">{group.clubName}</span>
              </div>
            ))}
          </div>
        )}

        {/* 하단 */}
        <div className="mt-auto pt-3 shrink-0">
          {isMany ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="w-full h-[38px] rounded-[6px] bg-transparent text-[13px] flex items-center justify-center gap-[6px] text-Gray-3"
            >
              {open ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-Gray-7 body_1_2">접기</span>
                  <Image src="/ArrowTop.svg" alt="" width={24} height={24} />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-Gray-7 body_1_2">전체보기</span>
                  <Image src="/ArrowDown.svg" alt="" width={24} height={24} />
                </div>
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSearchGroup}
                className="w-full h-[32px] t:h-[48px] py-3 rounded-[8px] bg-white border border-[#E6E6E6]
                          text-[13px] flex items-center justify-center gap-2"
              >
                <Image
                  src="/search.svg"
                  alt="모임 검색하기"
                  width={24}
                  height={24}
                  className="w-3.5 h-3.5 t:w-6 t:h-6"
                />
                <span className="text-primary-3 body_1_2 t:subhead_4_1">모임 검색하기</span>
              </button>

              <button
                type="button"
                onClick={handleCreateGroup}
                className="w-full h-[32px] t:h-[48px] py-3 rounded-[6px] bg-[#6B5448] text-white
                          text-[13px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image
                  src="/icon_plus.svg"
                  alt="icon_plus"
                  width={24}
                  height={24}
                  className="w-3.5 h-3.5 t:w-6 t:h-6"
                />
                <span className="text-color-white body_1_2 t:subhead_4_1">
                  모임 생성하기
                </span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
