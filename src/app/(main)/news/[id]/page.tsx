import TodayRecommendedBooks from "@/components/base-ui/News/today_recommended_books";
import Image from "next/image";
import { notFound } from "next/navigation";

const DUMMY_NEWS = [
  {
    id: 1,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: `📚✨ 책읽는 한강공원이 📖

25년 하반기에 다시 돌아옵니다 🎶💃🏼🎺
반짝이는 강물과 따스한 햇살 아래,특별한 프로그램들이 여러분을 기다립니다.

자연 속에서 즐기는 여유, 모두가 함께 만드는 즐거움, 그리고 한강에서만 느낄 수 있는 특별한 순간까지! 한강에서 가족, 친구, 연인과 함께 소중한 추억을 만들어 보세요. 💐🌺🍀🌷


특색 있는 공간조성과 콘텐츠로 업그레이드 되었습니다 ♥️
기대하시라 🎺개봉박두~~~~~


✨일정✨


📅 9월 6일 부터 매주토요일~

⏰ 13:00~20:00


📍여의도 한강공원 멀티프라자

하반기 : 2025.9.6..~10.25. 매주 토요일


#캘박필수❤️


다채로운 축제가 가득한 한강, 하반기에도 책읽는 한강공원에서 만나요 💖💗💝


#서울 #한강 #축제 #한강공원 #한강데이트 #데이트 #서울 #한강 #책읽는한강공원 #여의도한강공원 #책

#서울핫플 #위대한가이드 #잠원한강공원 #여의도한강공원 #광나루 #서울핫플추천 #서울팝업 #팝업스토어추천 #무료공연 #서울무료공연`,
  },
  {
    id: 2,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
  {
    id: 3,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
  {
    id: 4,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content: "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
];

const DUMMY_BOOKS = [
  {
    id: 1,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 2,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 3,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
  {
    id: 4,
    imgUrl: "/booksample.svg",
    title: "책 제목",
    author: "작가작가작가",
  },
];

function getNewsById(id: number) {
  return DUMMY_NEWS.find((news) => news.id === id);
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = getNewsById(Number(id));

  if (!news) {
    notFound();
  }

  return (
    <>
      <div className="relative w-screen h-[297px] t:h-[468px]">
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        
        
        <div className="absolute top-0 left-0 right-0 hidden d:flex h-[44px] d:h-[64px] border-b border-zinc-300">
          <div className="px-4 t:px-6 d:px-3 h-full flex gap-5 items-center justify-start w-full ml-5.5  max-w-[1440px] mx-auto">
            <div className="d:subhead_4_1 text-Gray-3">전체</div>
            <div className="relative w-[12px] h-[12px] d:w-[18px] d:h-[18px]">
              <Image
                src="/triangle.svg"
                alt="next"
                fill
                className="object-contain"
              />
            </div>
            <div className="d:subhead_4_1 text-Gray-7">글 상세보기</div>
          </div>
        </div>
      </div>

      {/* 메인  */}
      <div className="mx-auto w-full max-w-[1400px] px-9 t:px-[200px] mt-6 t:mt-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">{news.title}</h1>
          <p className="body_1_2 text-Gray-3">{news.date}</p>
        </div>

        {/* 본문  */}
        <div className="w-full max-w-[1040px] mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap">
            {news.fullContent || news.content}
          </p>
        </div>
      </div>
      <div className="w-screen -mx-4 my-8 border-b-4 border-Gray-1 mt-25"></div>
      <TodayRecommendedBooks books={DUMMY_BOOKS} className="mt-10" />
      
      {/* 문의하기 */}
      <button
        type="button"
        className="fixed bottom-[86px] right-6 t:bottom-8 t:right-8 z-[60] cursor-pointer hover:opacity-80 transition-opacity w-12 h-12 t:w-[88px] t:h-[88px]"
        aria-label="문의하기"
      >
        <Image
          src="/inquiry.svg"
          alt="문의하기"
          width={88}
          height={88}
          className="w-full h-full"
          priority
        />
      </button>
    </>
  );
}
