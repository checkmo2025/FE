"use client";

import NewsItem from "./items/AdminNewsItem";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 ID */
  userId: string;
};

// TODO: 관리자 사용자 뉴스 조회 API 연동 후 userId 기반 실제 데이터로 교체 예정
export default function NewsList({ userId }: Props) {
  // 현재는 구조 통일을 위해 props만 받고 사용하지 않음
  void userId;

  const posts = [
    {
      id: 1,
      imageUrl: "/...",
      title: "...",
      content: "...",
      date: "2025.01.01",
    },
  ];

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
      {posts.map((post) => (
        <NewsItem key={post.id} {...post} />
      ))}
    </div>
  );
}