// src/components/base-ui/Profile/BookStoryList.tsx
"use client";

import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

const MOCK_STORIES = [
  // ... (Mock 데이터 동일) ...
  {
    id: 1,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 128,
    title: "제목1",
    content: "내용...",
    likeCount: 42,
    commentCount: 12,
  },
  {
    id: 2,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 350,
    title: "제목2",
    content: "내용...",
    likeCount: 85,
    commentCount: 24,
  },
  {
    id: 3,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 95,
    title: "제목3",
    content: "내용...",
    likeCount: 30,
    commentCount: 5,
  },
  {
    id: 4,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 420,
    title: "제목4",
    content: "내용...",
    likeCount: 150,
    commentCount: 45,
  },
  {
    id: 5,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 210,
    title: "제목5",
    content: "내용...",
    likeCount: 67,
    commentCount: 18,
  },
  {
    id: 6,
    authorName: "hy",
    createdAt: new Date().toISOString(),
    viewCount: 88,
    title: "제목6",
    content: "내용...",
    likeCount: 55,
    commentCount: 9,
  },
];

export default function BookStoryList() {
  return (
    <div className="grid w-full grid-cols-1 gap-y-[40px] md:w-[688px] md:grid-cols-2 md:gap-x-[16px] xl:w-[1048px] xl:grid-cols-3 xl:gap-x-[20px]">
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
