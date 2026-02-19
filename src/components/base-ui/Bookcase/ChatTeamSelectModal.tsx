"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type ChatTeam = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

type Props = {
  isOpen: boolean;
  teams: ChatTeam[];
  onClose: () => void;
  title?: string;
};

const ICON_CLOSE = "/icon_minus_1.svg"; // 24x24
const ICON_ARROW_RIGHT = "/ArrowRight2.svg"; // 24x24
const ICON_BACK = "/ArrowLeft3.svg"; // 24x24
const ICON_SEND = "/Send.svg"; // 24x24

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function useIsTabletUp() {
  const [isTabletUp, setIsTabletUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTabletUp(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setIsTabletUp(e.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mql as any).addListener?.(onChange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => (mql as any).removeListener?.(onChange);
  }, []);

  return isTabletUp;
}

type ViewMode = "select" | "chat";

// ✅ 네 취향: 아이콘/버튼 hover
const HOVER_ICON =
  "cursor-pointer transition-[filter,transform] duration-150 ease-out hover:brightness-50 hover:scale-[1.05] active:scale-[0.98]";
const HOVER_SURFACE =
  "cursor-pointer transition-[filter,transform] duration-150 ease-out hover:brightness-95 hover:scale-[1.02] active:scale-[0.99]";
const HOVER_INPUT_WRAPPER =
  "cursor-pointer transition-[filter] duration-150 ease-out hover:brightness-95";

export default function ChatTeamSelectModal({
  isOpen,
  teams,
  onClose,
  title = "채팅 조 선택",
}: Props) {
  const isTabletUp = useIsTabletUp();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [view, setView] = useState<ViewMode>("select");
  const [activeTeam, setActiveTeam] = useState<ChatTeam | null>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setView("select");
    setActiveTeam(null);

    if (!isTabletUp) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return;
  }, [isOpen, isTabletUp]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isTabletUp) return;

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const w = panel?.offsetWidth ?? 366;
      const h = panel?.offsetHeight ?? 716;

      const margin = 8;
      const maxX = Math.max(margin, window.innerWidth - w - margin);
      const maxY = Math.max(margin, window.innerHeight - h - margin);

      const cx = clamp((window.innerWidth - w) / 2, margin, maxX);
      const cy = clamp((window.innerHeight - h) / 2, margin, maxY);

      setPos({ x: cx, y: cy });
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, isTabletUp]);

  useEffect(() => {
    if (!isOpen) return;

    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return;
      const panel = panelRef.current;
      if (!panel) return;

      const w = panel.offsetWidth;
      const h = panel.offsetHeight;

      const margin = 8;
      const maxX = Math.max(margin, window.innerWidth - w - margin);
      const maxY = Math.max(margin, window.innerHeight - h - margin);

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      const nx = clamp(dragRef.current.originX + dx, margin, maxX);
      const ny = clamp(dragRef.current.originY + dy, margin, maxY);

      setPos({ x: nx, y: ny });
    };

    const onUp = () => {
      dragRef.current.dragging = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isOpen]);

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (!isTabletUp) return;
    if (e.button !== 0) return;

    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.originX = posRef.current.x;
    dragRef.current.originY = posRef.current.y;
  };

  const handleSelectTeam = (team: ChatTeam) => {
    setActiveTeam(team);
    setView("chat");
  };

  const handleBack = () => {
    setView("select");
    setActiveTeam(null);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto t:pointer-events-none">
      <div
        ref={panelRef}
        style={
          isTabletUp
            ? { left: 0, top: 0, transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }
            : undefined
        }
        className={[
          "pointer-events-auto",
          "fixed inset-0 t:inset-auto",
          "w-full h-[100dvh] t:w-[366px] t:h-[716px]",
          "p-5",
          "flex flex-col items-start gap-5",
          "bg-background border border-Subbrown-4",
          "rounded-none t:rounded-[8px]",
          "shadow-[0_3px_5.1px_rgba(61,52,46,0.15)]",
        ].join(" ")}
      >
        {/* ===== 헤더 ===== */}
        {view === "select" ? (
          <div
            className={[
              "w-full flex items-center justify-between",
              isTabletUp ? "cursor-grab active:cursor-grabbing select-none touch-none" : "",
            ].join(" ")}
            onPointerDown={handleHeaderPointerDown}
          >
            <h2 className="text-Gray-7 subhead_4_1">{title}</h2>

            <button
              type="button"
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              className={["w-6 h-6 shrink-0 flex items-center justify-center", HOVER_ICON].join(" ")}
              aria-label="닫기"
            >
              <Image src={ICON_CLOSE} alt="" width={24} height={24} className="object-contain" />
            </button>
          </div>
        ) : (
          <div
            className={[
              "w-full grid grid-cols-[24px_1fr_24px] items-center",
              isTabletUp ? "cursor-grab active:cursor-grabbing select-none touch-none" : "",
            ].join(" ")}
            onPointerDown={handleHeaderPointerDown}
          >
            <button
              type="button"
              onClick={handleBack}
              onPointerDown={(e) => e.stopPropagation()}
              className={["w-6 h-6 flex items-center justify-center", HOVER_ICON].join(" ")}
              aria-label="뒤로"
            >
              <Image src={ICON_BACK} alt="" width={24} height={24} className="object-contain" />
            </button>

            <div className="text-center text-Gray-7 subhead_4_1 truncate">
              {activeTeam?.teamName ?? ""}
            </div>

            <button
              type="button"
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              className={["w-6 h-6 flex items-center justify-center justify-self-end", HOVER_ICON].join(
                " "
              )}
              aria-label="닫기"
            >
              <Image src={ICON_CLOSE} alt="" width={24} height={24} className="object-contain" />
            </button>
          </div>
        )}

        {/* ===== 본문 ===== */}
        {view === "select" ? (
          <div className="w-full flex flex-col gap-3 overflow-y-auto">
            {teams.map((team) => (
              <button
                key={team.teamId}
                type="button"
                onClick={() => handleSelectTeam(team)}
                className={[
                  "w-full flex items-center justify-between",
                  "p-3 rounded-[8px]",
                  "bg-Subbrown-4 text-Gray-7 body_1_2",
                  HOVER_SURFACE,
                ].join(" ")}
              >
                <span className="truncate">{team.teamName}</span>

                <Image
                  src={ICON_ARROW_RIGHT}
                  alt=""
                  width={24}
                  height={24}
                  className={["object-contain shrink-0", HOVER_ICON].join(" ")}
                />
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* 채팅 영역 */}
            <div className="w-full flex-1 overflow-y-auto">
              <div className="w-full flex flex-col gap-4">
                <div className="text-Gray-4 body_2_3 py-10 text-center">
                  채팅 UI 영역 (메시지 리스트 들어올 자리)
                </div>
              </div>
            </div>

            {/* 입력창 */}
            <div className="w-full">
              <div
                className={[
                  "w-full flex items-center gap-2 rounded-[8px]",
                  "border border-Subbrown-4 bg-White px-4 py-3",
                  HOVER_INPUT_WRAPPER,
                ].join(" ")}
                onClick={focusInput}
              >
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent outline-none text-Gray-7 body_1_2 placeholder:text-Gray-4 cursor-text"
                  placeholder="채팅 입력"
                />

                <button
                  type="button"
                  className={["w-6 h-6 shrink-0", HOVER_ICON].join(" ")}
                  aria-label="전송"
                >
                  <Image src={ICON_SEND} alt="" width={24} height={24} className="object-contain" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
