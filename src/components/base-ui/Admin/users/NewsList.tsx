"use client";

import { useEffect, useState } from "react";
import NewsItem from "./items/AdminNewsItem";
import {
  fetchAdminMemberNews,
  type AdminMemberNewsItem,
} from "@/lib/api/admin/member";

type Props = {
  /** 관리자 상세 페이지의 대상 유저 닉네임 */
  memberNickname: string;
};

export default function NewsList({ memberNickname }: Props) {
  const [posts, setPosts] = useState<AdminMemberNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetchAdminMemberNews(memberNickname, null);
        setPosts(res.result.basicInfoList ?? []);
      } catch (error) {
        console.error("회원 등록 소식 조회 실패:", error);
        setPosts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [memberNickname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-red-500 text-sm font-medium">
        멤버 등록 소식 불러오기 실패
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center w-full max-w-[1040px] mx-auto py-[80px]">
        <p className="text-Gray-4 text-sm font-medium whitespace-pre-wrap text-center">
          멤버 등록 소식 없음
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] w-full max-w-[1040px] mx-auto">
      {posts.map((post) => {
        const safeImageUrl =
          post.thumbnailUrl?.startsWith("http") ||
          post.thumbnailUrl?.startsWith("/")
            ? post.thumbnailUrl
            : "/placeholder.png";

        return (
          <NewsItem
            key={post.newsId}
            id={post.newsId}
            imageUrl={safeImageUrl}
            title={post.title}
            content={post.description}
            date={post.publishStartAt}
          />
        );
      })}
    </div>
  );
}