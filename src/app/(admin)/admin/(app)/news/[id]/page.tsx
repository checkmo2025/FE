import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAdminNewsDetail } from "@/lib/api/admin/news";

type Props = {
  params: { id: string };
};

export default async function AdminNewsDetailPage({ params }: Props) {
  const newsId = Number(params.id);

  if (Number.isNaN(newsId)) {
    notFound();
  }

  let news;

  try {
    const response = await fetchAdminNewsDetail(newsId);
    news = response.result;
  } catch (error) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <div className="relative w-screen h-[297px] t:h-[468px] overflow-hidden">
        <Image
          src={news.thumbnailUrl || "/news_sample4.svg"}
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
          게시기간 {news.publishStartAt} - {news.publishEndAt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="subhead_1 t:headline_3 text-Gray-7">
            {news.title}
          </h1>
          <p className="body_1_2 text-Gray-3">{news.createdAt}</p>
        </div>

        {/* 본문 */}
        <div className="w-full max-w-[1040px] mt-22">
          <p className="body_1_3 t:subhead_3 text-Gray-6 whitespace-pre-wrap">
            {news.content}
          </p>
        </div>

        {/* 수정 버튼 */}
        <div className="w-full max-w-[1040px] mt-[72px] mb-[87px]">
          <Link
            href={`/admin/news/${news.newsId}/edit`}
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