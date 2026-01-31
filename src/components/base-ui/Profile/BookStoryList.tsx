"use client";

import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

const MOCK_STORIES = [
  {
    id: 1,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 128,
    title: "한밤의 도서관에서 발견한 기적",
    content: "조용한 도서관 구석에서...",
    likeCount: 42,
    commentCount: 12,
  },
  {
    id: 2,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 350,
    title: "이기적 유전자, 다시 읽기",
    content: "대학 시절 읽었던...",
    likeCount: 85,
    commentCount: 24,
  },
  {
    id: 3,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 95,
    title: "여행의 이유를 찾아서",
    content: "김영하 작가님의...",
    likeCount: 30,
    commentCount: 5,
  },
  {
    id: 4,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 420,
    title: "돈의 심리학: 부의 비밀",
    content: "부자가 되는 것보다...",
    likeCount: 150,
    commentCount: 45,
  },
  {
    id: 5,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 210,
    title: "불편한 편의점의 따뜻한 위로",
    content: "제목과는 달리...",
    likeCount: 67,
    commentCount: 18,
  },
  {
    id: 6,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 88,
    title: "코스모스, 우주를 향한 항해",
    content: "칼 세이건의 코스모스는...",
    likeCount: 55,
    commentCount: 9,
  },
];

export default function BookStoryList() {
  return (
    <div
      className="grid w-full justify-items-center
      grid-cols-2 gap-x-[17px] gap-y-[12px]
      t:w-[688px] t:gap-x-[16px] t:gap-y-[40px]
      d:w-[1048px] d:grid-cols-3 d:gap-x-[20px]"
    >
      {MOCK_STORIES.map(({ id, ...storyData }) => (
        <BookStoryCard key={id} {...storyData} />
      ))}
    </div>
  );
}
