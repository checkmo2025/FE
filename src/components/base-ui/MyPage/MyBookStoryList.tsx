// src/components/base-ui/MyPage/MyBookStoryList.tsx
"use client";

import React from "react";
import BookStoryCard from "@/components/base-ui/BookStory/bookstory_card";

// Dummy Data for UI development
import { DUMMY_MY_STORIES } from "@/constants/mocks/mypage";

const MyBookStoryList = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-[1048px] md:w-[692px] lg:w-[1048px] mx-auto gap-[20px]">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[12px] lg:gap-[20px]">
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
