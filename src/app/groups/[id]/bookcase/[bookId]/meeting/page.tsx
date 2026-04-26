/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import FloatingFab from "@/components/base-ui/Float";
import ChatTeamSelectModal, {
  ChatTeam,
} from "@/components/base-ui/Bookcase/ChatTeamSelectModal";
import MeetingChatModal from "@/components/base-ui/Bookcase/MeetingChatModal";
import { useMeetingDetailQuery } from "@/hooks/queries/useMeetingQueries";
import { useMeetingTopicsQuery } from "@/hooks/queries/useMeetingTopicQueries";
import { useAuthStore } from "@/store/useAuthStore";
import type { MeetingTopicItem } from "@/types/groups/meetingTopics";

import MeetingTeamMemberPopover from "@/components/base-ui/Bookcase/MeetingTeamMemberPopover";
import toast from "react-hot-toast";
import { useMeetingRealtime } from "@/hooks/realtime/useMeetingRealtime";

type TeamViewModel = {
  teamId: number;
  teamNumber: number;
  teamName: string;
  memberCount: number;
};

const CHECKED_BG = "#F7FEF3";
const DEFAULT_PROFILE = "/profile4.svg";

const makePresentationPendingKey = (teamId: number, topicId: number) =>
  `${teamId}:${topicId}`;

function teamNumberToLabel(teamNumber: number) {
  const code = 64 + teamNumber;
  if (code >= 65 && code <= 90) return `${String.fromCharCode(code)}조`;
  return `${teamNumber}조`;
}

function normalizeSrc(src?: string | null) {
  if (!src || src.trim() === "") return DEFAULT_PROFILE;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

function sortSelectedFirstStable(list: MeetingTopicItem[]) {
  const baseIndex = new Map(list.map((item, index) => [item.topicId, index]));
  const next = [...list];

  next.sort((a, b) => {
    const aSelected = a.isSelected ? 1 : 0;
    const bSelected = b.isSelected ? 1 : 0;

    if (bSelected !== aSelected) return bSelected - aSelected;
    return (baseIndex.get(a.topicId) ?? 0) - (baseIndex.get(b.topicId) ?? 0);
  });

  return next;
}

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clubId = Number(params.id);
  const meetingId = Number(params.bookId);

  const { user } = useAuthStore();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [sortSelectedFirst, setSortSelectedFirst] = useState(false);

  const [isTeamSelectModalOpen, setIsTeamSelectModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatTeamId, setSelectedChatTeamId] = useState<number | null>(null);

  const [pendingPresentationKeys, setPendingPresentationKeys] = useState<Set<string>>(
    new Set()
  );

  const addPendingPresentation = useCallback((teamId: number, topicId: number) => {
    const key = makePresentationPendingKey(teamId, topicId);

    setPendingPresentationKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const removePendingPresentation = useCallback((teamId: number, topicId: number) => {
    const key = makePresentationPendingKey(teamId, topicId);

    setPendingPresentationKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clearPendingPresentations = useCallback(() => {
    setPendingPresentationKeys(new Set());
  }, []);

  const [chatPosition, setChatPosition] = useState({ x: 980, y: 56 });

  useEffect(() => {
    const clampChatPosition = () => {
      if (window.innerWidth < 768) return;

      const panelWidth = 426;
      const panelHeight = 716;

      setChatPosition((prev) => ({
        x: Math.max(0, Math.min(window.innerWidth - panelWidth, prev.x)),
        y: Math.max(0, Math.min(window.innerHeight - panelHeight, prev.y)),
      }));
    };

    clampChatPosition();
    window.addEventListener("resize", clampChatPosition);

    return () => window.removeEventListener("resize", clampChatPosition);
  }, []);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const {
    data: meetingData,
    isLoading: isMeetingLoading,
    isError: isMeetingError,
  } = useMeetingDetailQuery(clubId, meetingId);

  const isStaff = !!meetingData?.isStaff;

  const teams = useMemo<TeamViewModel[]>(() => {
    if (!meetingData) return [];

    const memberCountMap = new Map<number, number>();
    for (const group of meetingData.teamMembers ?? []) {
      memberCountMap.set(group.teamKey.teamId, group.members.length);
    }

    return (meetingData.existingTeams ?? []).map((team) => ({
      teamId: team.teamId,
      teamNumber: team.teamNumber,
      teamName: teamNumberToLabel(team.teamNumber),
      memberCount: memberCountMap.get(team.teamId) ?? 0,
    }));
  }, [meetingData]);

  const myTeamId = useMemo(() => {
    const myNickname = user?.nickname?.trim();
    if (!myNickname || !meetingData) return null;

    for (const group of meetingData.teamMembers ?? []) {
      const matched = group.members.some(
        (member) => member.memberInfo.nickname === myNickname
      );
      if (matched) return group.teamKey.teamId;
    }

    return null;
  }, [meetingData, user?.nickname]);

  useEffect(() => {
    if (teams.length === 0) {
      setSelectedTeamId(null);
      return;
    }

    const teamIdFromQuery = Number(searchParams.get("teamId"));
    const teamLabelFromQuery = searchParams.get("team");

    const matchedById = Number.isFinite(teamIdFromQuery)
      ? teams.find((team) => team.teamId === teamIdFromQuery)
      : undefined;

    const matchedByLabel = teamLabelFromQuery
      ? teams.find((team) => team.teamName === teamLabelFromQuery)
      : undefined;

    if (matchedById) {
      setSelectedTeamId(matchedById.teamId);
      return;
    }

    if (matchedByLabel) {
      setSelectedTeamId(matchedByLabel.teamId);
      return;
    }

    setSelectedTeamId((prev) => {
      if (prev && teams.some((team) => team.teamId === prev)) return prev;
      return teams[0].teamId;
    });
  }, [teams, searchParams]);

  const selectedTeam = useMemo(
    () => teams.find((team) => team.teamId === selectedTeamId) ?? null,
    [teams, selectedTeamId]
  );

  const selectedTeamMembers = useMemo(() => {
    if (!meetingData || selectedTeamId === null) return [];

    const matchedGroup = meetingData.teamMembers.find(
      (group) => group.teamKey.teamId === selectedTeamId
    );

    return matchedGroup?.members ?? [];
  }, [meetingData, selectedTeamId]);

  const topicsQuery = useMeetingTopicsQuery(
    clubId,
    meetingId,
    selectedTeamId ?? Number.NaN,
    Number.isFinite(selectedTeamId)
  );

  const visibleTopics = useMemo(() => {
    const topics = topicsQuery.data?.topics ?? [];
    return sortSelectedFirst ? sortSelectedFirstStable(topics) : topics;
  }, [topicsQuery.data?.topics, sortSelectedFirst]);

  const canSelectCurrentTeamTopic =
    isStaff || (selectedTeamId !== null && myTeamId === selectedTeamId);

  const presentationSubscribeTeamId = isStaff ? selectedTeamId : myTeamId;

  const chatSelectableTeams = useMemo<ChatTeam[]>(() => {
    const mapped = teams.map((team) => ({
      teamId: String(team.teamId),
      teamName: team.teamName,
      memberCount: team.memberCount,
    }));

    if (isStaff) return mapped;
    if (!myTeamId) return [];
    return mapped.filter((team) => Number(team.teamId) === myTeamId);
  }, [teams, isStaff, myTeamId]);

  const {
    isConnected,
    canSubscribeChat,
    publishChatMessage,
    publishPresentation,
  } = useMeetingRealtime({
    clubId,
    meetingId,
    presentationTeamId: presentationSubscribeTeamId ?? null,
    chatTeamId: selectedChatTeamId,
    isChatOpen: isChatModalOpen,
    isStaff,
    myTeamId,
    enabled: Number.isFinite(clubId) && Number.isFinite(meetingId) && !!meetingData,
    onPresentationEvent: (event) => {
      removePendingPresentation(event.teamId, event.topicId);
    },
    onRealtimeResynced: () => {
      clearPendingPresentations();
    },
  });

  useEffect(() => {
    if (chatSelectableTeams.length === 0) {
      setSelectedChatTeamId(null);
      setIsChatModalOpen(false);
      setIsTeamSelectModalOpen(false);
      return;
    }

    if (
      selectedChatTeamId !== null &&
      !chatSelectableTeams.some((team) => Number(team.teamId) === selectedChatTeamId)
    ) {
      setSelectedChatTeamId(Number(chatSelectableTeams[0].teamId));
      setIsChatModalOpen(false);
    }
  }, [chatSelectableTeams, selectedChatTeamId]);

  const handleSelectTeam = (teamName: string) => {
    const matched = teams.find((team) => team.teamName === teamName);
    if (!matched) return;

    console.log("[meeting page] handleSelectTeam", {
      clickedTeamName: teamName,
      nextTeamId: matched.teamId,
      prevSelectedTeamId: selectedTeamId,
      myTeamId,
      presentationSubscribeTeamId,
    });

    setSelectedTeamId(matched.teamId);

    const next = new URLSearchParams(searchParams.toString());
    next.set("teamId", String(matched.teamId));
    next.set("team", matched.teamName);

    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleOpenChatSelectModal = () => {
    if (chatSelectableTeams.length === 0) return;
    setIsTeamSelectModalOpen(true);
  };

  const handleSelectChatTeam = (team: ChatTeam) => {
    const nextTeamId = Number(team.teamId);

    if (!isStaff && myTeamId !== nextTeamId) {
      toast.error("본인 팀 채팅만 열 수 있습니다.");
      return;
    }

    setSelectedChatTeamId(nextTeamId);
    setIsTeamSelectModalOpen(false);
    setIsChatModalOpen(true);
  };

  const handleCloseAllChatLayers = () => {
    setIsTeamSelectModalOpen(false);
    setIsChatModalOpen(false);
  };

  const handleBackToTeamSelect = () => {
    setIsChatModalOpen(false);
    setIsTeamSelectModalOpen(true);
  };

  const handleSendChatMessage = (content: string) => {
    if (selectedChatTeamId === null) return;

    try {
      publishChatMessage(selectedChatTeamId, content);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "채팅 전송 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  const handleChatDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: chatPosition.x,
      originY: chatPosition.y,
    };

    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      const panelWidth = 426;
      const panelHeight = 716;

      const nextX = Math.max(
        0,
        Math.min(window.innerWidth - panelWidth, dragRef.current.originX + dx)
      );

      const nextY = Math.max(
        0,
        Math.min(window.innerHeight - panelHeight, dragRef.current.originY + dy)
      );

      setChatPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.userSelect = "";
    };
  }, []);

  const handleTogglePresentation = (topicId: number, currentSelected: boolean) => {
    if (selectedTeamId === null) return;

    const key = makePresentationPendingKey(selectedTeamId, topicId);

    if (!canSelectCurrentTeamTopic) {
      toast.error("현재 조의 발제만 선택할 수 있습니다.");
      return;
    }

    if (!isConnected) {
      toast.error("실시간 연결이 아직 되지 않았습니다.");
      return;
    }

    if (pendingPresentationKeys.has(key)) {
      return;
    }

    addPendingPresentation(selectedTeamId, topicId);

    try {
      publishPresentation(selectedTeamId, topicId, !currentSelected);
    } catch (error) {
      removePendingPresentation(selectedTeamId, topicId);

      const message =
        error instanceof Error ? error.message : "발제 선택 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  if (isMeetingLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1040px] px-5 t:px-0 py-6">
          <div className="rounded-[8px] bg-[#F2EFEE] p-5 text-Gray-4 body_1_2">
            팀 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (isMeetingError || !meetingData) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1040px] px-5 t:px-0 py-6">
          <div className="rounded-[8px] bg-[#F2EFEE] p-5 text-Red-500 body_1_2">
            팀 정보를 불러오지 못했습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1040px] px-5 t:px-0 py-6 flex flex-col gap-[16px]">
        <div className="w-full border-b border-Subbrown-4">
          <div
            className="
              flex flex-nowrap items-center gap-[8px] py-[16px]
              overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {teams.map((team) => {
              const isActive = selectedTeam?.teamId === team.teamId;

              return (
                <button
                  key={team.teamId}
                  type="button"
                  onClick={() => handleSelectTeam(team.teamName)}
                  className={[
                    "shrink-0 flex h-[36px] min-w-[83px] items-center justify-center rounded-[4px] border px-[10px] transition-colors body_2_2 cursor-pointer",
                    isActive
                      ? "bg-primary-2 border-primary-2 text-White"
                      : "bg-White border-Subbrown-4 text-Gray-7 hover:bg-Gray-2",
                  ].join(" ")}
                >
                  {team.teamName}
                </button>
              );
            })}
          </div>
        </div>

        {selectedTeam ? (
          <div className="w-full flex flex-col gap-[16px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-Gray-7 subhead_4_1">{selectedTeam.teamName}</span>

                <MeetingTeamMemberPopover
                  memberCount={selectedTeam.memberCount}
                  members={selectedTeamMembers}
                />
              </div>

              <button
                type="button"
                onClick={() => setSortSelectedFirst((prev) => !prev)}
                className="flex items-center gap-2 text-Gray-5 body_2_3 cursor-pointer hover:scale-[1.03]"
                aria-label="정렬하기"
              >
                <div className="relative w-4 h-4 t:w-5 t:h-5">
                  <Image src="/Swap.svg" alt="" fill className="object-contain" />
                </div>
                정렬하기
              </button>
            </div>

            {topicsQuery.isLoading && (
              <div className="rounded-[8px] border border-Subbrown-4 bg-White px-5 py-6 text-Gray-4 body_1_2">
                발제를 불러오는 중...
              </div>
            )}

            {topicsQuery.isError && (
              <div className="rounded-[8px] border border-Subbrown-4 bg-White px-5 py-6 text-Red-500 body_1_2">
                발제를 불러오지 못했습니다.
              </div>
            )}

            {!topicsQuery.isLoading && !topicsQuery.isError && (
              <div className="w-full flex flex-col gap-[6px]">
                {visibleTopics.length === 0 ? (
                  <div className="rounded-[8px] border border-Subbrown-4 bg-White px-5 py-6 text-center text-Gray-4 body_2_3">
                    작성된 발제가 없습니다.
                  </div>
                ) : (
                  visibleTopics.map((topic) => {
                    const profileSrc = normalizeSrc(topic.author.profileImageUrl);
                    const isPending =
                      selectedTeamId !== null &&
                      pendingPresentationKeys.has(
                        makePresentationPendingKey(selectedTeamId, topic.topicId)
                      );

                    return (
                      <div
                        key={topic.topicId}
                        className="w-full flex flex-col rounded-[8px] border border-Subbrown-4 bg-White px-5 py-3 transition-colors"
                        style={topic.isSelected ? { backgroundColor: CHECKED_BG } : undefined}
                      >
                        <div className="grid grid-cols-[auto_1fr_auto] items-center t:flex t:items-center t:gap-3">
                          <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
                            <Image
                              src={profileSrc}
                              alt=""
                              width={28}
                              height={28}
                              className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
                            />
                            <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">
                              {topic.author.nickname}
                            </p>
                          </div>

                          <p
                            className="
                              hidden t:block
                              min-w-0 flex-1
                              text-Gray-7
                              body_2_3 d:body_1_2
                              [font-feature-settings:'case'_on]
                              break-words
                            "
                          >
                            {topic.content}
                          </p>

                          <button
                            type="button"
                            disabled={!canSelectCurrentTeamTopic || !isConnected || isPending}
                            onClick={() => handleTogglePresentation(topic.topicId, topic.isSelected)}
                            title={
                              !canSelectCurrentTeamTopic
                                ? "다른 조 발제는 조회만 가능합니다."
                                : !isConnected
                                ? "실시간 연결 중입니다."
                                : isPending
                                ? "선택 반영 중입니다."
                                : topic.isSelected
                                ? "발제 선택을 해제합니다."
                                : "이 발제를 선택합니다."
                            }
                            className={[
                              "relative w-6 h-6 shrink-0 justify-self-end",
                              !canSelectCurrentTeamTopic || !isConnected || isPending
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer",
                            ].join(" ")}
                            aria-label="발제 선택 상태"
                            aria-busy={isPending}
                          >
                            <Image
                              src={topic.isSelected ? "/CheckOn.svg" : "/CheckOff.svg"}
                              alt=""
                              fill
                              className="object-contain"
                            />
                          </button>
                        </div>

                        <p
                          className="
                            mt-2
                            t:hidden
                            text-Gray-7
                            body_2_3
                            [font-feature-settings:'case'_on]
                            break-words
                          "
                        >
                          {topic.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-10 text-center text-Gray-4 body_2_3">
            선택 가능한 조가 없습니다.
          </div>
        )}
      </div>

      <FloatingFab
        iconSrc="/icons_chat.svg"
        iconAlt="채팅"
        onClick={handleOpenChatSelectModal}
        className={`${isTeamSelectModalOpen || isChatModalOpen ? "mb-15 t:mb-0" : ""}`}
      />

      <ChatTeamSelectModal
        isOpen={isTeamSelectModalOpen}
        teams={chatSelectableTeams}
        onClose={handleCloseAllChatLayers}
        onSelectTeam={handleSelectChatTeam}
      />

      <MeetingChatModal
        isOpen={isChatModalOpen}
        clubId={clubId}
        meetingId={meetingId}
        teams={chatSelectableTeams}
        selectedTeamId={selectedChatTeamId}
        onClose={handleCloseAllChatLayers}
        onBack={handleBackToTeamSelect}
        onSelectTeam={(teamId) => {
          const matched = chatSelectableTeams.find(
            (team) => Number(team.teamId) === teamId
          );
          if (!matched) return;
          handleSelectChatTeam(matched);
        }}
        position={chatPosition}
        onDragStart={handleChatDragStart}
        onSendMessage={handleSendChatMessage}
        isSocketConnected={isConnected}
        canSendMessage={canSubscribeChat}
      />
    </div>
  );
}