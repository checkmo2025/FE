"use client";

import { useState } from "react";
import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import BookDetailNav from "@/components/base-ui/Bookcase/BookDetailNav";
import MeetingInfo from "@/components/base-ui/Bookcase/MeetingInfo";
import DebateSection from "./DebateSection";
import TeamFilter from "@/components/base-ui/Group/TeamFilter";
import TeamSection from "@/components/base-ui/Group/TeamSection";

// --- Mock Data ---
const MOCK_BOOK_DETAIL = {
  title: "채식주의자",
  author: "한강 지음",
  imageUrl: "/dummy_book_cover.png",
  description: `책을 좋아하는 사람들이 모여 각자의 속도로 읽고... (생략)`,
  category: { generation: "7기", genre: "소설/시/희곡" },
  rating: 4.5,
};

const MOCK_MEETING_INFO = {
  name: "정기모임 이름 어쩌고",
  date: "2000.00.00",
  location: "제이스 스터디룸",
};

const MOCK_DEBATE_TOPICS = [
  {
    id: 1,
    name: "_hy_0716",
    content:
      "메노키오의 사례에서 볼 수 있듯이 시대마다 ‘허용되는 사상’과 ‘탄압받는 사상’이 존재한다. 현대사회에서 비슷한 사례는 무엇이 있을까?",
  },
  {
    id: 2,
    name: "_hy_0716",
    content: "표현의 자유는 어디까지 허용되어야 하는가? 플랫폼 규제는 검열인가 보호인가?",
  },
  {
    id: 3,
    name: "_hy_0716",
    content: "지금 우리가 ‘당연하다’고 믿는 상식 중, 훗날 탄압/조롱의 대상이 될 수도 있는 건 뭐가 있을까?",
  },
];

// 조별 멤버 데이터
const MOCK_TEAMS_DATA = [
  {
    teamName: "A조",
    members: [
      { id: "1", name: "유저 1", profileImageUrl: "/dummy_profile.png" },
      { id: "2", name: "유저 2", profileImageUrl: "/dummy_profile.png" },
      { id: "3", name: "유저 3", profileImageUrl: "/dummy_profile.png" },
    ],
  },
  {
    teamName: "B조",
    members: [
      { id: "4", name: "유저 4" }, // 이미지 없는 경우 테스트
      { id: "5", name: "유저 5" },
    ],
  },
  { teamName: "C조", members: [] },
  { teamName: "D조", members: [] },
  { teamName: "E조", members: [] },
  { teamName: "F조", members: [] },
];

export default function AdminBookDetailPage() {
  const [activeTab, setActiveTab] = useState<"발제" | "한줄평" | "정기모임">(
    "정기모임"
  );

  const  DEFAULT_PROFILE = "/profile4.svg";
  const [MyprofileImageUrl, setMyprofileImageUrl] = useState("/profile4.svg");
  const [MyName, setMyName] = useState("aasdfsad");

  // 발제
  const [isDebateWriting, setIsDebateWriting] = useState(false);
  const [debateDraft, setDebateDraft] = useState("");

  // 조 선택 상태 관리
  const [selectedTeam, setSelectedTeam] = useState("A조");
  
  // 현재 선택된 조의 데이터 찾기
  const currentTeamData = MOCK_TEAMS_DATA.find(
    (t) => t.teamName === selectedTeam
  );

  return (
    <div className="flex flex-col w-full items-start gap-[24px]">
      <div className="flex flex-col w-full items-start gap-[40px]">
        {/* 1. 도서 상세 카드 */}
        <BookDetailCard
          title={MOCK_BOOK_DETAIL.title}
          author={MOCK_BOOK_DETAIL.author}
          imageUrl={MOCK_BOOK_DETAIL.imageUrl}
          description={MOCK_BOOK_DETAIL.description}
          category={MOCK_BOOK_DETAIL.category}
          rating={MOCK_BOOK_DETAIL.rating}
        />

        {/* 2. 하단 상세 정보 영역 */}
        <div className="flex w-full flex-col items-start gap-[24px] self-stretch">
          {/* 내비게이션 바 */}
          <BookDetailNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 탭 컨텐츠 영역 */}
          <div className="flex flex-col items-start gap-[24px] self-stretch">
            {activeTab === "정기모임" && (
              <>
                {/* 2-1. 모임 정보 카드 */}
                <MeetingInfo
                  meetingName={MOCK_MEETING_INFO.name}
                  date={MOCK_MEETING_INFO.date}
                  location={MOCK_MEETING_INFO.location}
                />

                {/* 2-2. 조별 멤버 리스트 영역 (Frame 2087328794) */}
                <div className="flex flex-col items-start gap-[16px] self-stretch">
                  {/* 조 선택 필터 (Frame 2087328778) */}
                  <TeamFilter
                    teams={MOCK_TEAMS_DATA.map((t) => t.teamName)}
                    selectedTeam={selectedTeam}
                    onSelect={setSelectedTeam}
                  />

                  {/* 선택된 조의 멤버 리스트 섹션 (Frame 2087328793) */}
                  {currentTeamData && (
                    <TeamSection
                      teamName={currentTeamData.teamName}
                      members={currentTeamData.members}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === '발제' && (
              <DebateSection
                myName={MyName}
                myProfileImageUrl={MyprofileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isWriting={isDebateWriting}
                onToggleWriting={() => setIsDebateWriting((v) => !v)}
                onSendDebate={(text) => {
                  console.log('send:', text);
                  // TODO: API 붙일 곳
                  return true;
                }}
                items={MOCK_DEBATE_TOPICS}
              />
            )}


            {activeTab === "한줄평" && (
              <div className="w-full p-10 text-center text-Gray-4">
                한줄평 콘텐츠 준비 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
