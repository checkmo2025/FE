"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useMeetingChatsInfiniteQuery } from "@/hooks/queries/useMeetingChatQueries";
import type { ChatTeam } from "@/components/base-ui/Bookcase/ChatTeamSelectModal";
import type { MeetingChatMessageItem } from "@/types/groups/meetingChats";

type Props = {
  isOpen: boolean;
  clubId: number;
  meetingId: number;
  teams: ChatTeam[];
  selectedTeamId: number | null;
  onClose: () => void;
  onBack: () => void;
  onSelectTeam: (teamId: number) => void;
  position: { x: number; y: number };
  onDragStart: (e: React.PointerEvent<HTMLDivElement>) => void;

  onSendMessage: (content: string) => void;
  isSocketConnected: boolean;
  canSendMessage: boolean;
};

const DEFAULT_PROFILE = "/profile4.svg";

function normalizeSrc(src?: string | null) {
  if (!src || src.trim() === "") return DEFAULT_PROFILE;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function dedupeAndSortMessages(list: MeetingChatMessageItem[]) {
  const map = new Map<number, MeetingChatMessageItem>();

  for (const item of list) {
    map.set(item.messageId, item);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.messageId !== b.messageId) return a.messageId - b.messageId;
    return new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime();
  });
}

export default function MeetingChatModal({
  isOpen,
  clubId,
  meetingId,
  teams,
  selectedTeamId,
  onClose,
  onBack,
  onSelectTeam,
  position,
  onDragStart,
  onSendMessage,
  isSocketConnected,
  canSendMessage,
}: Props) {
  const selectedTeam =
    teams.find((team) => Number(team.teamId) === selectedTeamId) ?? null;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const autoScrolledRef = useRef(false);

  const [isTabletUp, setIsTabletUp] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsTabletUp(mq.matches);

    sync();

    if (mq.addEventListener) {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }

    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  const chatsQuery = useMeetingChatsInfiniteQuery(
    clubId,
    meetingId,
    selectedTeamId ?? Number.NaN,
    isOpen && Number.isFinite(selectedTeamId)
  );

  const messages = useMemo(() => {
    const flat = chatsQuery.data?.pages.flatMap((page) => page.chats) ?? [];
    return dedupeAndSortMessages(flat);
  }, [chatsQuery.data]);

  useEffect(() => {
    if (!isOpen) {
      autoScrolledRef.current = false;
      return;
    }

    const root = scrollRef.current;
    const target = topSentinelRef.current;

    if (!root || !target || !chatsQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          chatsQuery.hasNextPage &&
          !chatsQuery.isFetchingNextPage
        ) {
          chatsQuery.fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "120px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    isOpen,
    chatsQuery.hasNextPage,
    chatsQuery.isFetchingNextPage,
    chatsQuery.fetchNextPage,
    selectedTeamId,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    if (!scrollRef.current) return;
    if (messages.length === 0) return;
    if (autoScrolledRef.current) return;

    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      autoScrolledRef.current = true;
    });
  }, [isOpen, messages.length, selectedTeamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft("");
  }, [selectedTeamId, isOpen]);

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) return;
    if (!isSocketConnected || !canSendMessage) return;

    onSendMessage(content);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    handleSubmit();
  };

  const inputPlaceholder = !isSocketConnected
    ? "실시간 연결 중입니다."
    : !canSendMessage
    ? "이 조 채팅은 보낼 수 없습니다."
    : "메시지를 입력하세요";

  if (!isOpen) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[80]",
        isTabletUp ? "pointer-events-none" : "bg-black/10",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-auto flex flex-col border border-Subbrown-4 bg-background shadow-[0_3px_5.1px_rgba(61,52,46,0.15)]",
          isTabletUp
            ? "absolute h-[716px] w-[426px] rounded-[8px]"
            : "h-[100dvh] w-full",
        ].join(" ")}
        style={isTabletUp ? { left: position.x, top: position.y } : undefined}
      >
        <div
          onPointerDown={isTabletUp ? onDragStart : undefined}
          className={[
            "grid grid-cols-[24px_1fr_24px] items-center border-b border-Subbrown-4 px-5 py-4",
            isTabletUp ? "cursor-move select-none" : "",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onBack}
            className="relative h-6 w-6 cursor-pointer hover:brightness-75"
            aria-label="뒤로"
          >
            <Image src="/ArrowLeft3.svg" alt="" fill className="object-contain" />
          </button>

          <div className="truncate text-center text-Gray-7 subhead_4_1">
            {selectedTeam?.teamName ?? ""}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative h-6 w-6 cursor-pointer hover:brightness-75"
            aria-label="닫기"
          >
            <Image src="/icon_minus_1.svg" alt="" fill className="object-contain" />
          </button>
        </div>

        {teams.length > 1 && (
          <div className="border-b border-Subbrown-4 px-5 py-3">
            <div
              className="
                flex flex-nowrap items-center gap-[8px]
                overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-smooth
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              "
            >
              {teams.map((team) => {
                const isActive = Number(team.teamId) === selectedTeamId;

                return (
                  <button
                    key={team.teamId}
                    type="button"
                    onClick={() => {
                      autoScrolledRef.current = false;
                      onSelectTeam(Number(team.teamId));
                    }}
                    className={[
                      "body_2_2 flex h-[36px] min-w-[83px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border px-[10px] transition-colors",
                      isActive
                        ? "border-primary-2 bg-primary-2 text-White"
                        : "border-Subbrown-4 bg-White text-Gray-7 hover:bg-Gray-1",
                    ].join(" ")}
                  >
                    {team.teamName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
          <div ref={topSentinelRef} />

          {chatsQuery.isFetchingNextPage && (
            <div className="pb-3 text-center text-Gray-4 body_2_3">
              이전 메시지 불러오는 중...
            </div>
          )}

          {chatsQuery.isLoading ? (
            <div className="flex h-full items-center justify-center text-Gray-4 body_1_2">
              채팅 내역을 불러오는 중...
            </div>
          ) : chatsQuery.isError ? (
            <div className="flex h-full items-center justify-center text-Red-500 body_1_2">
              채팅 내역을 불러오지 못했습니다.
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-Gray-4 body_2_3">
              아직 채팅이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => {
                const profileSrc = normalizeSrc(message.sender.profileImageUrl);

                return (
                  <div key={message.messageId} className="flex items-start gap-3">
                    <Image
                      src={profileSrc}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-Gray-7 body_1_2">
                          {message.sender.nickname}
                        </span>
                        <span className="text-Gray-4 body_2_3">
                          {formatTime(message.sendAt)}
                        </span>
                      </div>

                      <div className="body_2_3 w-fit max-w-full whitespace-pre-wrap break-words rounded-[12px] bg-[#F6F3F1] px-4 py-3 text-Gray-7">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-Subbrown-4 px-5 py-4">
          <div
            className={[
              "flex items-center gap-3 rounded-[8px] border border-Subbrown-4 bg-White px-4 py-3",
              !isSocketConnected || !canSendMessage ? "opacity-60" : "",
            ].join(" ")}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isSocketConnected || !canSendMessage}
              className="body_1_2 flex-1 bg-transparent text-Gray-5 outline-none"
              placeholder={inputPlaceholder}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isSocketConnected || !canSendMessage || !draft.trim()}
              className={[
                "relative h-6 w-6 shrink-0",
                !isSocketConnected || !canSendMessage || !draft.trim()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:brightness-90",
              ].join(" ")}
              aria-label="채팅 전송"
            >
              <Image src="/Send.svg" alt="" fill className="object-contain" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}