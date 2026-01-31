"use client";

import NewsList from "@/components/base-ui/News/news_list";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

// UI 확인을 위한 Mock Data
const MOCK_NEWS = [
  {
    id: 1,
    title: "새로운 독서 모임이 등록되었습니다.",
    content:
      "회원님의 관심 카테고리인 '인문학' 분야의 새로운 모임 [철학으로 아침을 여는 사람들]이 개설되었습니다. 지금 바로 확인해보세요!",
    date: "2025-10-09",
    imageUrl: "/dummy_book_1.png", // public 폴더 내 이미지 경로
  },
  {
    id: 2,
    title: "10월 독서 마라톤 챌린지 안내",
    content:
      "풍성한 가을을 맞아 독서 마라톤 챌린지가 시작됩니다. 완주하신 분들께는 한정판 뱃지와 포인트가 지급됩니다. 자세한 내용은 공지사항을 참고해주세요.",
    date: "2025-10-01",
    imageUrl: "/dummy_book_2.png",
  },
  {
    id: 3,
    title: "시스템 점검 안내 (10/15 02:00 ~ 06:00)",
    content:
      "더 안정적인 서비스 제공을 위해 서버 점검이 예정되어 있습니다. 점검 시간에는 서비스 이용이 제한되오니 양해 부탁드립니다.",
    date: "2025-09-28",
    imageUrl: "/dummy_book_3.png",
  },
];

export default function MyNewsPage() {
  return (
    <SettingsDetailLayout
      title="내 소식 관리"
      className="gap-[8px] xl:w-auto xl:px-0"
    >
      {MOCK_NEWS.map((news) => (
        <NewsList
          key={news.id}
          id={news.id}
          title={news.title}
          content={news.content}
          date={news.date}
          imageUrl={news.imageUrl}
          className="w-full"
        />
      ))}
    </SettingsDetailLayout>
  );
}
