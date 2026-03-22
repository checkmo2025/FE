/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type TeamViewModel = {
  teamId: number;
  teamNumber: number;
  teamName: string;
  memberCount: number;
};

const CHECKED_BG = "#F7FEF3";
const DEFAULT_PROFILE = "/profile4.svg";

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

  const clubId = Number(params.id as string);
  const meetingId = Number(params.bookId as string);

  const { user } = useAuthStore();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [sortSelectedFirst, setSortSelectedFirst] = useState(false);

  const [isTeamSelectModalOpen, setIsTeamSelectModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatTeamId, setSelectedChatTeamId] = useState<number | null>(null);

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
    // TODO:
    // 현재 응답에는 "내 clubMemberId"가 없어서 nickname 기반 임시 판별만 가능.
    // 추후 BE가 내 clubMemberId를 내려주면 그 값 기준으로 교체할 것.
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
    setSelectedChatTeamId(Number(team.teamId));
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
                      : "bg-White border-Subbrown-4 text-Gray-7 hover:bg-Gray-1",
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
                            disabled
                            title={
                              canSelectCurrentTeamTopic
                                ? "발제 선택/해제는 다음 단계에서 연결합니다."
                                : "다른 조 발제는 조회만 가능합니다."
                            }
                            className={[
                              "relative w-6 h-6 shrink-0 justify-self-end",
                              canSelectCurrentTeamTopic
                                ? "cursor-default"
                                : "cursor-not-allowed opacity-70",
                            ].join(" ")}
                            aria-label="발제 선택 상태"
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
        onSelectTeam={(teamId) => setSelectedChatTeamId(teamId)}
      />
    </div>
  );
}