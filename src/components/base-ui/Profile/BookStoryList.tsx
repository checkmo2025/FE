// src/components/base-ui/MyPage/OtherUserBookStoryList.tsx
"use client";

import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

// Mock 데이터 (이곳으로 이동)
const MOCK_STORIES = [
  {
    id: 1,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    viewCount: 128,
    title: "한밤의 도서관에서 발견한 기적",
    content:
      "조용한 도서관 구석에서 우연히 집어 든 책 한 권이 제 인생을 바꿀 줄은 몰랐습니다...",
    likeCount: 42,
    commentCount: 12,
  },
  {
    id: 2,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    viewCount: 350,
    title: "이기적 유전자, 다시 읽기",
    content:
      "대학 시절 읽었던 이기적 유전자를 10년 만에 다시 꺼내 읽었습니다...",
    likeCount: 85,
    commentCount: 24,
  },
  {
    id: 3,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    viewCount: 95,
    title: "여행의 이유를 찾아서",
    content:
      "김영하 작가님의 산문집을 읽으며 내가 왜 그토록 여행을 갈망했는지...",
    likeCount: 30,
    commentCount: 5,
  },
  {
    id: 4,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    viewCount: 420,
    title: "돈의 심리학: 부의 비밀",
    content:
      "부자가 되는 것보다 부자로 남는 것이 더 어렵다는 말이 기억에 남습니다...",
    likeCount: 150,
    commentCount: 45,
  },
  {
    id: 5,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    viewCount: 210,
    title: "불편한 편의점의 따뜻한 위로",
    content: "제목과는 달리 너무나도 편안하고 따뜻한 이야기였습니다...",
    likeCount: 67,
    commentCount: 18,
  },
  {
    id: 6,
    authorName: "hy",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    viewCount: 88,
    title: "코스모스, 우주를 향한 항해",
    content: "칼 세이건의 코스모스는 단순한 과학책이 아닙니다...",
    likeCount: 55,
    commentCount: 9,
  },
];

export default function BookStoryList() {
  return (
    <div className="grid w-[1048px] grid-cols-3 gap-x-[20px] gap-y-[40px]">
      {MOCK_STORIES.map((story) => (
        <BookStoryCard
          key={story.id}
          authorName={story.authorName}
          createdAt={story.createdAt}
          viewCount={story.viewCount}
          title={story.title}
          content={story.content}
          likeCount={story.likeCount}
          commentCount={story.commentCount}
        />
      ))}
    </div>
  );
}
