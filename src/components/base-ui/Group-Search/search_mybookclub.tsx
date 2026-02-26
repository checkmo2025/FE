"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type GroupSummary = { id: string; name: string };

type Props = {
  groups: GroupSummary[];
  isLoading?: boolean;
};

function getLimitByViewport() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1440px)").matches) return 6;
  if (window.matchMedia("(min-width: 768px)").matches) return 4;
  return 3;
}

export default function Mybookclub({ groups, isLoading = false }: Props) {
  const count = groups.length;

  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(3);

  const router = useRouter();

  useEffect(() => {
    const apply = () => setLimit(getLimitByViewport());
    apply();

    const mqd = window.matchMedia("(min-width: 1440px)");
    const mqt = window.matchMedia("(min-width: 768px)");

    const onChange = () => apply();

    (mqd as MediaQueryList).addEventListener("change", onChange);
    (mqt as MediaQueryList).addEventListener("change", onChange);

    return () => {
      (mqd as MediaQueryList).removeEventListener("change", onChange);
      (mqt as MediaQueryList).removeEventListener("change", onChange);
    };
  }, []);

  const showToggle = !isLoading && count > limit;

  const displayGroups = useMemo(() => {
    if (isLoading) return [];
    if (!showToggle) return groups;
    return open ? groups : groups.slice(0, limit);
  }, [groups, open, limit, showToggle, isLoading]);

  return (
    <aside
      className={[
        "flex flex-col w-full d:w-[332px] p-5 rounded-[8px] bg-Subbrown-4",
        open && showToggle ? "max-h-[814px]" : "",
      ].join(" ")}
    >
      {/* ✅ 로딩 중이거나 0개면 로고 */}
      {isLoading || count === 0 ? (
        <div className="flex items-center justify-center py-4 t:py-10 d:py-20">
          <Image src="/logo2.svg" alt="로고" height={300} width={300} />
        </div>
      ) : (
        <>
          <div
            className={[
              "grid grid-cols-1 t:grid-cols-2 d:grid-cols-1 flex-col gap-2",
              open && showToggle ? "overflow-y-auto pr-1 no-scrollbar" : "",
            ].join(" ")}
          >
            {displayGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => router.push(`/groups/${group.id}`)}
                className="flex w-full h-[36px] t:h-[52px] py-3 px-4 items-center rounded-lg bg-white hover:brightness-98 hover:-translate-y-[1px] cursor-pointer"
              >
                <span className="text-Gray-7 body_1_2 t:subhead_4_1">
                  {group.name}
                </span>
              </div>
            ))}
          </div>

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
                  <div className="flex items-center justify-center gap-1 hover:brightness-98 cursor-pointer">
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