"use client";

import { useState } from "react";
import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import BookDetailNav from "@/components/base-ui/Bookcase/BookDetailNav";
import MeetingInfo from "@/components/base-ui/Bookcase/MeetingInfo";
import DebateSection from "./DebateSection";
import TeamFilter from "@/components/base-ui/Bookcase/bookid/TeamFilter";
import TeamSection from "@/components/base-ui/Bookcase/bookid/TeamSection";
import ReviewSection from "./ReviewSection";

import {
  MOCK_BOOK_DETAIL,
  MOCK_MEETING_INFO,
  MOCK_DEBATE_TOPICS,
  MOCK_TEAMS_DATA,
  MOCK_REVIEWS,
} from './dummy';

export default function AdminBookDetailPage() {
  const [activeTab, setActiveTab] = useState<"발제" | "한줄평" | "정기모임">(
    "정기모임"
  );
  const [MyprofileImageUrl, setMyprofileImageUrl] = useState("/profile4.svg");
  const [MyName, setMyName] = useState("aasdfsad");

  // 발제
  const [isDebateWriting, setIsDebateWriting] = useState(false);

  const [isReviewWriting, setIsReviewWriting] = useState(false);
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


            {activeTab === '한줄평' && (
              <ReviewSection
                myName={MyName}
                myProfileImageUrl={MyprofileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isWriting={isReviewWriting}
                onToggleWriting={() => setIsReviewWriting((v) => !v)}
                onSendReview={(text, rating) => {
                  console.log('review send:', { text, rating });
                  return true;
                }}
                items={MOCK_REVIEWS}
                onClickMore={(id) => console.log('more:', id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
