/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type Team = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

type TeamDebateItem = {
  id: number | string;
  name: string;
  content: string;
  profileImageUrl?: string | null;
};


const CHECKED_BG = "#F7FEF3"; 
const DEFAULT_PROFILE = "/profile4.svg";

const normalizeSrc = (src?: string | null) => {
  if (!src) return DEFAULT_PROFILE;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
};

const buildCheckedMap = (list: TeamDebateItem[]) => {
  const next: Record<string, boolean> = {};
  list.forEach((x) => (next[String(x.id)] = false));
  return next;
};

const sortCheckedFirstStable = (
  list: TeamDebateItem[],
  checkedMap: Record<string, boolean>
) => {
  // "현재 순서"를 기준으로 stable 정렬
  const baseIndex = new Map(list.map((x, i) => [String(x.id), i]));
  const next = [...list];

  next.sort((a, b) => {
    const ca = checkedMap[String(a.id)] ? 1 : 0;
    const cb = checkedMap[String(b.id)] ? 1 : 0;

    // checked가 먼저
    if (cb !== ca) return cb - ca;

    // 같은 그룹이면 기존 순서 유지
    return (baseIndex.get(String(a.id)) ?? 0) - (baseIndex.get(String(b.id)) ?? 0);
  });

  return next;
};

/** ----------------------------
 * Dummy API (나중에 진짜 API로 교체)
 * ---------------------------*/
async function apiGetTeams(bookId: string): Promise<Team[]> {
  return [
    { teamId: "1", teamName: "A조", memberCount: 20 },
    { teamId: "2", teamName: "B조", memberCount: 18 },
    { teamId: "3", teamName: "C조", memberCount: 16 },
  ];
}

async function apiGetTeamDebates(
  bookId: string,
  teamId: string
): Promise<TeamDebateItem[]> {
  return [
    {
      id: 1,
      name: "_hy_0716",
      content:
        "메노키오의 사례에서 볼 수 있듯이 시대마다 ‘허용되는 사상’과 ‘탄압받는 사상’이 존재한다. 현대사회에서 비슷한 사례는 무엇이 있을까?",
      profileImageUrl: "profile4.svg",
    },
    {
      id: 2,
      name: "_hy_0716",
      content:
        "표현의 자유는 어디까지 허용되어야 하는가? 플랫폼 규제는 검열인가 보호인가?",
      profileImageUrl: "profile4.svg",
    },
    {
      id: 3,
      name: "_hy_0716",
      content:
        "지금 우리가 ‘당연하다’고 믿는 상식 중, 훗날 탄압/조롱의 대상이 될 수도 있는 건 뭐가 있을까?",
      profileImageUrl: "profile4.svg",
    },
    {
      id: 4,
      name: "_hy_0716",
      content:
        "메노키오의 사례에서 볼 수 있듯이 시대마다 ‘허용되는 사상’과 ‘탄압받는 사상’이 존재한다. 현대사회에서 비슷한 사례는 무엇이 있을까?",
      profileImageUrl: "profile4.svg",
    },
    {
      id: 5,
      name: "_hy_0716",
      content:
        "표현의 자유는 어디까지 허용되어야 하는가? 플랫폼 규제는 검열인가 보호인가?",
      profileImageUrl: "profile4.svg",
    },
    {
      id: 6,
      name: "_hy_0716",
      content:
        "지금 우리가 ‘당연하다’고 믿는 상식 중, 훗날 탄압/조롱의 대상이 될 수도 있는 건 뭐가 있을까?",
      profileImageUrl: "profile4.svg",
    },
  ];
}

export default function MeetingPage({
  params,
}: {
  params: { groupId: string; bookId: string };
}) {
  const { bookId } = params;
  const sp = useSearchParams();
  const initialTeamName = sp.get("team"); // ?team=A조

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const [items, setItems] = useState<TeamDebateItem[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const selectedTeam = useMemo(
    () => teams.find((t) => t.teamId === selectedTeamId) ?? null,
    [teams, selectedTeamId]
  );
  const selectedTeamName = selectedTeam?.teamName ?? "";
  const teamNames = useMemo(() => teams.map((t) => t.teamName), [teams]);

  const resetDebates = () => {
    setItems([]);
    setCheckedMap({});
  };

  /** 1) 팀 목록 로드 + 초기 선택 */
  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await apiGetTeams(bookId);
      if (ignore) return;

      setTeams(res);

      if (res.length === 0) {
        setSelectedTeamId(null);
        resetDebates();
        return;
      }

      const byName = initialTeamName
        ? res.find((t) => t.teamName === initialTeamName)
        : null;

      setSelectedTeamId((byName ?? res[0]).teamId);
    })();

    return () => {
      ignore = true;
    };
    // initialTeamName으로 초기 선택 바뀔 수 있으니 포함
  }, [bookId, initialTeamName]);

  /** 2) 팀 선택 바뀌면 발제 로드 + 체크 초기화 */
  useEffect(() => {
    if (!selectedTeamId) {
      resetDebates();
      return;
    }

    let ignore = false;

    (async () => {
      const res = await apiGetTeamDebates(bookId, selectedTeamId);
      if (ignore) return;

      setItems(res);
      setCheckedMap(buildCheckedMap(res));
    })();

    return () => {
      ignore = true;
    };
  }, [bookId, selectedTeamId]);

  /** handlers */
  const handleSelectTeam = (teamName: string) => {
    const t = teams.find((x) => x.teamName === teamName);
    setSelectedTeamId(t?.teamId ?? null);
  };

  const handleToggleCheck = (id: string) => {
    const key = String(id);
    setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSortCheckedFirst = () => {
    setItems((prev) => sortCheckedFirstStable(prev, checkedMap));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[540px] px-5 t:px-0 py-6 flex flex-col gap-[16px]">
        {/* TeamFilter */}
        <div className="w-full border-b border-Subbrown-4">
          <div
            className="
              flex flex-nowrap items-center gap-[8px] py-[16px]
              overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {teamNames.map((team) => {
              const isActive = selectedTeamName === team;
              return (
                <button
                  key={team}
                  type="button"
                  onClick={() => handleSelectTeam(team)}
                  className={[
                    "shrink-0 flex h-[36px] min-w-[83px] items-center justify-center rounded-[4px] border px-[10px] transition-colors body_2_2",
                    isActive
                      ? "bg-primary-2 border-primary-2 text-White"
                      : "bg-White border-Subbrown-4 text-Gray-7 hover:bg-Gray-1",
                  ].join(" ")}
                >
                  {team}
                </button>
              );
            })}
          </div>
        </div>

        {selectedTeam ? (
          <div className="w-full flex flex-col gap-[16px]">
            {/* 헤더 */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-Gray-7 subhead_4_1">
                  {selectedTeam.teamName}
                </span>

                <div className="flex items-center gap-1 text-Gray-5">
                  <div className="relative w-4 h-4 t:w-5 t:h-5">
                    <Image
                      src="/profile10.svg"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="body_2_3">{selectedTeam.memberCount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSortCheckedFirst}
                className="flex items-center gap-2 text-Gray-5 body_2_3"
                aria-label="정렬하기"
              >
                <div className="relative w-4 h-4 t:w-5 t:h-5">
                  <Image
                    src="/Swap.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                정렬하기
              </button>
            </div>

            {/* 발제 리스트 */}
            <div className="w-full flex flex-col gap-[6px]">
              {items.map((item) => {
                const id = String(item.id);
                const isChecked = checkedMap[id] === true;

                const profileSrc = normalizeSrc(item.profileImageUrl);

                return (
                  <div
                    key={id}
                    className="
                      w-full
                      flex flex-col
                      rounded-[8px]
                      border border-Subbrown-4
                      bg-White
                      px-5 py-3
                      transition-colors
                    "
                    style={isChecked ? { backgroundColor: CHECKED_BG } : undefined}
                  >
                    {/* 모바일: grid로 2줄 구성 (위: 프로필+이름+체크 / 아래: 내용)
                        t 이상: flex 한 줄 */}
                    <div
                      className="
                        grid grid-cols-[auto_1fr_auto] items-center
                        t:flex t:items-center t:gap-3
                      "
                    >
                      {/* 프로필 + 이름: '한 덩어리' */}
                      <div className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px]">
                        <Image
                          src={profileSrc}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full object-cover w-[24px] h-[24px] t:w-[28px] t:h-[28px] d:w-[40px] d:h-[40px]"
                        />
                        <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">
                          {item.name}
                        </p>
                      </div>

                      {/* t 이상에서만 내용이 같은 줄로 옴 */}
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
                        {item.content}
                      </p>

                      {/* 체크 아이콘 */}
                      <button
                        type="button"
                        onClick={() => handleToggleCheck(id)}
                        className="relative w-6 h-6 shrink-0 justify-self-end"
                        aria-label="체크 토글"
                      >
                        <Image
                          src={isChecked ? "/CheckOn.svg" : "/CheckOff.svg"}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </button>
                    </div>

                    {/* 모바일에서만: 내용이 아래로 내려감 (name 아래 라인) */}
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
                      {item.content}
                    </p>
                  </div>
                );
              })}
            </div>


          </div>
        ) : (
          <div className="w-full py-10 text-center text-Gray-4 body_2_3">
            작성된 발제가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
