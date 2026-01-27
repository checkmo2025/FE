// src/components/base-ui/MyPage/MyBookStoryList.tsx
"use client";

import React from "react";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

// Dummy Data for UI development
const DUMMY_MY_STORIES = [
  {
    id: 1,
    authorName: "hy_0716",
    createdAt: "2023-10-25T10:00:00Z",
    viewCount: 128,
    title: "어린 왕자를 읽고 나서",
    content:
      "나는 나이든 왕자다. 그 누가 숫자가 중요하다가 했던가. 세고 또 세는 그런 마법같은 경험을 한사람은 놀랍도록 이세상에 얼마 안된다! 나는 숲이 아닌 바다란걸...",
    likeCount: 42,
    commentCount: 5,
    coverImgSrc: "/BookImgSample.svg", // Ensure this image exists in public or use a placeholder
  },
  {
    id: 2,
    authorName: "hy_0716",
    createdAt: "2023-10-20T14:30:00Z",
    viewCount: 85,
    title: "나의 라임 오렌지 나무",
    content:
      "제제, 너는 너무 조숙해. 하지만 우리는 모두 사랑받기 위해 태어난 존재란다. 밍기뉴와 함께한 시간들이...",
    likeCount: 23,
    commentCount: 2,
    coverImgSrc: "/BookImgSample.svg",
  },
  {
    id: 3,
    authorName: "hy_0716",
    createdAt: "2023-10-15T09:15:00Z",
    viewCount: 256,
    title: "데미안: 알을 깨고 나오다",
    content:
      "새는 알에서 나오려고 투쟁한다. 알은 세계다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다. 아브락사스...",
    likeCount: 67,
    commentCount: 12,
    coverImgSrc: "/BookImgSample.svg",
  },
];

const MyBookStoryList = () => {
  return (
    <div className="flex flex-col items-center w-[1048px] gap-[20px]">
      <div className="w-full grid grid-cols-3 gap-[20px]">
        {DUMMY_MY_STORIES.map((story) => (
          <BookStoryCard
            key={story.id}
            authorName={story.authorName}
            createdAt={story.createdAt}
            viewCount={story.viewCount}
            title={story.title}
            content={story.content}
            likeCount={story.likeCount}
            commentCount={story.commentCount}
            coverImgSrc={story.coverImgSrc}
            // Optional props
            profileImgSrc="/profile2.svg"
          />
        ))}
      </div>
    </div>
  );
};

export default MyBookStoryList;
