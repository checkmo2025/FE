// NewsList.tsx
"use client";
import NewsItem from "./items/AdminNewsItem";

export default function NewsList() {
  const posts = [
    { id: 1, imageUrl: "/...", title: "...", content: "...", date: "2025.01.01" },
  ];

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
        {posts.map(post => (
            <NewsItem key={post.id} {...post} />
        ))}
    </div>
  );
}