"use client";

import BookcaseCard from "@/components/base-ui/Bookcase/BookcaseCard";
import FloatingFab from "@/components/base-ui/Float";
import { BookcaseApiResponse, groupByGeneration } from "@/types/groups/bookcasehome";
import { useParams, useRouter } from "next/navigation";



//API 형태 그대로
const MOCK_BOOKCASE_RESPONSE: BookcaseApiResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    bookShelfInfoList: [
      {
        meetingInfo: { meetingId: 2, generation: 1, tag: "MEETING", averageRate: 3 },
        bookInfo: {
          bookId: "9791192625133",
          title: "거인의 어깨 1 - 벤저민 그레이엄, 워런 버핏, 피터 린치에게 배우다",
          author: "홍진채",
          imgUrl: null,
        },
      },
      {
        meetingInfo: { meetingId: 1, generation: 1, tag: "MEETING", averageRate: 4.5 },
        bookInfo: {
          bookId: "9791192005317",
          title: "살인자ㅇ난감",
          author: "꼬마비",
          imgUrl: null,
        },
      },
      {
        meetingInfo: { meetingId: 3, generation: 2, tag: "MEETING", averageRate: 3.8 },
        bookInfo: {
          bookId: "1",
          title: "더미 책",
          author: "더미 작가",
          imgUrl: null,
        },
      },
    ],
    hasNext: false,
    nextCursor: null,
  },
};

export default function BookcasePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const sections = groupByGeneration(MOCK_BOOKCASE_RESPONSE.result.bookShelfInfoList);

  type TabParam = "topic" | "review" | "meeting";

  const handleGoToDetail = (meetingId: number, tab: TabParam) => {
  router.push(`/groups/${groupId}/bookcase/${meetingId}?tab=${tab}`);
};

  return (
    <div className="w-full flex flex-col gap-[24px]">
      {/* 책장 리스트 영역 */}
      {sections.map((section) => (
        <section
          key={section.generationNumber}
          className="flex flex-col items-start gap-[8px] self-stretch"
        >
          {/* 기수 라벨 */}
          <div className="flex w-[112px] items-center gap-[10px] px-[12px] py-[10px]">
            <span className="text-Gray-4 body_1_2">{section.generationLabel}</span>
          </div>

          {/* 카드 리스트 */}
          <div className="flex flex-wrap items-center gap-[10px] self-stretch justify-center d:justify-start">
            {section.books.map((book) => (
              <BookcaseCard
                key={`${book.meetingId}-${book.bookId}`} // bookId만 쓰면 중복날 수도 있음
                title={book.title}
                author={book.author}
                imageUrl={book.imageUrl}
                category={book.category}
                rating={book.rating}
                onTopicClick={() => handleGoToDetail(book.meetingId, "topic")}
                onReviewClick={() => handleGoToDetail(book.meetingId, "review")}
                onMeetingClick={() => handleGoToDetail(book.meetingId, "meeting")}
              />
            ))}
          </div>
        </section>
      ))}

      <FloatingFab
        iconSrc="/icons_pencil.svg"
        iconAlt="문의하기"
        onClick={() => router.push(`/groups/${groupId}/admin/bookcase/new`)}
      />
    </div>
  );
}
