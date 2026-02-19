"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export type GroupSummary = { id: string; name: string };

type Props = {
  groups: GroupSummary[];
};

function getLimitByViewport() {
  if (typeof window === "undefined") return 3; // SSR fallback
  if (window.matchMedia("(min-width: 1440px)").matches) return 6; // d~
  if (window.matchMedia("(min-width: 768px)").matches) return 4;  // t
  return 3; // mobile
}

export default function Mybookclub({ groups }: Props) {
  const count = groups.length;

  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(3);

  useEffect(() => {
    const apply = () => setLimit(getLimitByViewport());
    apply();

    const mqd = window.matchMedia("(min-width: 1440px)");
    const mqt = window.matchMedia("(min-width: 768px)");

    const onChange = () => apply();

    // 타입 이슈 회피용 캐스팅 (구형 브라우저는 신경 끄기)
    (mqd as MediaQueryList).addEventListener("change", onChange);
    (mqt as MediaQueryList).addEventListener("change", onChange);

    return () => {
      (mqd as MediaQueryList).removeEventListener("change", onChange);
      (mqt as MediaQueryList).removeEventListener("change", onChange);
    };
  }, []);


  const showToggle = count > limit;

  const displayGroups = useMemo(() => {
    if (!showToggle) return groups;
    return open ? groups : groups.slice(0, limit);
  }, [groups, open, limit, showToggle]);

  return (
    <aside
      className={[
        "flex flex-col w-full d:w-[332px] p-5 rounded-[8px] bg-Subbrown-4",
        // 높이 고정 대신 자연스럽게. 펼쳤을 때만 스크롤
        open && showToggle ? "max-h-[814px]" : "",
      ].join(" ")}
    >
      {/* 0개: 로고만 */}
      {count === 0 ? (
        <div className="h-[] flex items-center justify-center py-4 t:py-10 d:py-20">
        <Image src="/logo2.svg" alt="로고" height={300} width={300} />

        </div>
      ) : (
        <>
          {/* 리스트 */}
          <div
            className={[
              "grid grid-cols-1 t:grid-cols-2 d:grid-cols-1 flex-col gap-2",
              open && showToggle ? "overflow-y-auto pr-1" : "",
            ].join(" ")}
          >
            {displayGroups.map((group) => (
              <div
                key={group.id}
                className="flex w-full h-[36px] t:h-[52px] py-3 px-4 items-center rounded-lg bg-white  hover:brightness-98 hover:-translate-y-[1px] cursor-pointer"
              >
                <span className="text-Gray-7 body_1_2 t:subhead_4_1">
                  {group.name}
                </span>
              </div>
            ))}
          </div>

          {/* 전체보기/접기만 */}
          {showToggle && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full rounded-[6px] bg-transparent text-[13px] flex items-center justify-center gap-[6px] text-Gray-3"
              >
                {open ? (
                  <div className="flex items-center justify-center gap-1 hover:brightness-98 cursor-pointer">
                    <span className="text-Gray-7 body_1_2">접기</span>
                    <Image src="/ArrowTop.svg" alt="" width={24} height={24} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 hover:brightness-98  cursor-pointer">
                    <span className="text-Gray-7 body_1_2">전체보기</span>
                    <Image src="/ArrowDown.svg" alt="" width={24} height={24} />
                  </div>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
