import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const DUMMY_NEWS = [
  {
    id: 1,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content:
      "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
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

다채로운 축제가 가득한 한강, 하반기에도 책읽는 한강공원에서 만나요 💖💗💝`,
  },
  {
    id: 2,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content:
      "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
  {
    id: 3,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content:
      "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
  {
    id: 4,
    imageUrl: "/news_sample4.svg",
    title: "책 읽는 한강공원",
    content:
      "소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용소식내용",
    date: "2025-10-09",
    fullContent: "소식 상세 내용.",
  },
];

function getNewsById(id: number) {
  return DUMMY_NEWS.find((news) => news.id === id);
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = getNewsById(Number(id));

  if (!news) notFound();

  return (
    <>
      {/* Hero */}
      <div className="relative w-screen h-[297px] t:h-[468px] overflow-hidden">
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Main */}
      <div className="mx-auto w-full max-w-[1400px] px-9 t:px-[200px] mt-6 t:mt-10">
        <p className="body_2_2 text-Gray-4 mb-2">
          게시기간 2000.00.00 - 2000.00.00
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">
            {news.title}
          </h1>
          <p className="body_1_2 text-Gray-3">{news.date}</p>
        </div>

        {/* 본문 */}
        <div className="w-full max-w-[1040px] mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap">
            {news.fullContent || news.content}
          </p>
        </div>

        {/* 수정 버튼 */}
        <div className="w-full max-w-[1040px] mt-[72px] mb-[87px]">
          <Link
            href={`/admin/news/${news.id}/edit`}
            className="
              inline-flex items-center
              w-[120px] h-[40px]
              rounded
              bg-primary-1
              text-White
              text-[14px]
              body_2
              pl-[16px]
              gap-[8px]
              hover:opacity-90
            "
          >
            <Image
              src="/AdminEdit.svg"
              alt="수정 아이콘"
              width={24}
              height={24}
            />
            수정하기
          </Link>
        </div>
      </div>
    </>
  );
}