import Image from "next/image";

export default function LandingNewsSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="flex min-h-[520px] flex-col t:flex-row">
        {/* 좌측: 풀블리드 배경 + 카드 cascade */}
        <div className="relative min-h-[400px] w-full overflow-hidden t:w-[56%] t:shrink-0">
          {/* 배경 이미지 */}
          <Image
            src="/landing/landing-fourth-news1.svg"
            alt="소식 배경"
            fill
            className="object-cover"
          />

          {/* 카드 cascade - 뒤에서 앞으로 쌓임 */}
          {/* 카드 2 - 가장 뒤, 많이 기울어짐 */}
          <div className="absolute bottom-[28%] left-[6%] w-[62%] rotate-[-14deg] drop-shadow-xl">
            <Image
              src="/landing/landing-fourth-news2.svg"
              alt="소식 카드"
              width={400}
              height={220}
              className="w-full rounded-xl"
            />
          </div>
          {/* 카드 3 - 중간 */}
          <div className="absolute bottom-[16%] left-[12%] w-[66%] rotate-[-7deg] drop-shadow-xl">
            <Image
              src="/landing/landing-fourth-news3.svg"
              alt="소식 카드"
              width={420}
              height={240}
              className="w-full rounded-xl"
            />
          </div>
          {/* 카드 4 - 가장 앞, 거의 수평 */}
          <div className="absolute bottom-[2%] left-[16%] w-[72%] rotate-[-2deg] drop-shadow-2xl">
            <Image
              src="/landing/landing-fourth-news4.svg"
              alt="소식 카드"
              width={460}
              height={260}
              className="w-full rounded-xl"
            />
          </div>
        </div>

        {/* 우측: 텍스트 */}
        <div className="flex flex-1 flex-col justify-center gap-4 px-8 py-16 t:px-14 t:py-0">
          <div className="flex flex-col gap-0.5">
            <span className="subhead_3_1 font-bold text-primary-1">소식</span>
            <span className="body_1_2 text-Gray-4">News</span>
          </div>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            책과 관련된 행사, 전시, 프로그램
            <br />
            소식을 한 곳에서 확인할 수 있어요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            지난 소식까지 아카이빙하여, 필요한 정보를 다시 찾아보고
            <br />
            꾸준히 살펴볼 수 있어요.
          </p>
        </div>
      </div>
    </section>
  );
}
