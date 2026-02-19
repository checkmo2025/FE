"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";

import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import BookDetailNav, { Tab as TabKey } from "@/components/base-ui/Bookcase/BookDetailNav";
import DebateSection from "./DebateSection";
import ReviewSection from "./ReviewSection";


import {
  MOCK_BOOK_DETAIL,
  MOCK_DEBATE_TOPICS,
  MOCK_REVIEWS,
} from "./dummy";
import MeetingTabSection from "../MeetingTabSection";

function isTabKey(v: string | null): v is TabKey {
  return v === "topic" || v === "review" || v === "meeting";
}

export default function AdminBookDetailPage() {
  const router = useRouter();
  const pathname = usePathname(); // /groups/201/bookcase/3
  const searchParams = useSearchParams();
  const params = useParams();

  const groupId = params.id as string;
  const meetingIdParam = (params.meetingId ?? params.bookId) as string; // 폴더명 차이 커버
  const meetingId = Number(meetingIdParam);

  const [activeTab, setActiveTab] = useState<TabKey>("meeting");

  const [myProfileImageUrl] = useState("/profile4.svg");
  const [myName] = useState("aasdfsad");

  const [isDebateWriting, setIsDebateWriting] = useState(false);
  const [isReviewWriting, setIsReviewWriting] = useState(false);

  // URL -> state 동기화 (직접 ?tab=topic 들어와도 맞춰줌)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (isTabKey(tab) && tab !== activeTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
    if (!tab) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tab", "meeting");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }

  }, [searchParams]);

  // state -> URL 동기화 (탭 바꾸면 ?tab=도 같이 바뀜)
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", tab);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleManageTeams = () => {
    // ✅ 여기 네 라우트에 맞게 바꿔라. "관리자일 때만 버튼 노출"은 MeetingTabSection에서 처리함.
    router.push(`/groups/${groupId}/admin/bookcase/${meetingId}`);
  };

  return (
    <div className="flex flex-col w-full items-start gap-[24px]">
      <div className="flex flex-col w-full items-start gap-[40px]">
        <BookDetailCard
          title={MOCK_BOOK_DETAIL.title}
          author={MOCK_BOOK_DETAIL.author}
          imageUrl={MOCK_BOOK_DETAIL.imageUrl}
          description={MOCK_BOOK_DETAIL.description}
          category={MOCK_BOOK_DETAIL.category}
          rating={MOCK_BOOK_DETAIL.rating}
        />

        <div className="flex w-full flex-col items-start gap-[24px] self-stretch">
          <BookDetailNav activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="flex flex-col items-start gap-[24px] self-stretch">
            {activeTab === "meeting" && (
              <MeetingTabSection
                meetingId={meetingId}
                onManageTeamsClick={handleManageTeams}
              />
            )}

            {activeTab === "topic" && (
              <DebateSection
                myName={myName}
                myProfileImageUrl={myProfileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isWriting={isDebateWriting}
                onToggleWriting={() => setIsDebateWriting((v) => !v)}
                onSendDebate={(text) => {
                  console.log("topic send:", { meetingId, text });
                  // TODO: topic API 연결부
                  return true;
                }}
                items={MOCK_DEBATE_TOPICS}
              />
            )}

            {activeTab === "review" && (
              <ReviewSection
                myName={myName}
                myProfileImageUrl={myProfileImageUrl}
                defaultProfileUrl="/profile4.svg"
                isWriting={isReviewWriting}
                onToggleWriting={() => setIsReviewWriting((v) => !v)}
                onSendReview={(text, rating) => {
                  console.log("review send:", { meetingId, text, rating });
                  // TODO: review API 연결부
                  return true;
                }}
                items={MOCK_REVIEWS}
                onClickMore={(id) => console.log("more:", id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}