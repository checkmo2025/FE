"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export type GroupSummary = { id: string; name: string };

type Props = {
  groups: GroupSummary[];
  isLoading?: boolean;
  /** 박스 하단(내부)에 렌더할 추가 영역(예: 홈의 모임 검색/생성 버튼). 전체보기 토글이 보일 때는 숨겨짐 */
  footer?: ReactNode;
  /** true면 모든 화면에서 모임 목록을 1열로 표시(태블릿 2열 분기 제거). 예: 홈 */
  singleColumn?: boolean;
  /** 펼친 목록을 기존 레이아웃 높이에 영향을 주지 않는 오버레이로 표시 */
  overlayWhenOpen?: boolean;
};

function getLimitByViewport() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1440px)").matches) return 6;
  if (window.matchMedia("(min-width: 768px)").matches) return 4;
  return 3;
}

export default function Mybookclub({
  groups,
  isLoading = false,
  footer,
  singleColumn = false,
  overlayWhenOpen = false,
}: Props) {
  const count = groups.length;

  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(3);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useOnClickOutside(containerRef, () => {
    if (open) setOpen(false);
  });

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

  const isOverlayOpen = overlayWhenOpen && open && showToggle;

  const handleToggle = () => {
    if (!open && overlayWhenOpen) {
      setCollapsedHeight(asideRef.current?.offsetHeight ?? null);
    }
    setOpen((value) => !value);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full d:w-[332px]"
      style={isOverlayOpen && collapsedHeight ? { height: collapsedHeight } : undefined}
    >
      <aside
        ref={asideRef}
        className={[
          "flex flex-col w-full d:w-[332px] p-5 rounded-[8px] bg-Subbrown-4 transition-all duration-300",
          open && showToggle ? "max-h-[calc(100vh-2rem)] t:max-h-[814px]" : "",
          isOverlayOpen
            ? "absolute left-0 top-0 z-50 border border-Subbrown-3 shadow-2xl"
            : "",
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
              "grid gap-2 flex-col",
              singleColumn ? "grid-cols-1" : "grid-cols-1 t:grid-cols-2 d:grid-cols-1",
              open && showToggle ? "overflow-y-auto pr-1 no-scrollbar" : "",
            ].join(" ")}
          >
            {displayGroups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex w-full min-w-0 h-[36px] t:h-[52px] py-3 px-4 items-center overflow-hidden rounded-lg bg-white hover:brightness-98 hover:-translate-y-[1px] cursor-pointer"
                title={group.name}
              >
                <span className="block w-full min-w-0 truncate text-Gray-7 body_1_2 t:subhead_4_1">
                  {group.name}
                </span>
              </Link>
            ))}
          </div>

          {showToggle && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleToggle}
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

      {/* 전체보기 토글이 있으면 버튼 생략, 토글이 없을 때(목록이 한도 이내/0개)만 노출 */}
      {footer && !showToggle && <div className="mt-3 shrink-0">{footer}</div>}
      </aside>
    </div>
  );
}
