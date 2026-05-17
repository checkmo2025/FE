import Image from "next/image";

export default function LandingNewsSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="flex min-h-[600px] flex-col t:flex-row">
        {/* 좌측: 배경 상단 + 카드 cascade */}
        <div className="relative min-h-[500px] w-full t:w-[58%] t:shrink-0">
          {/* 블러 배경 - 상단에만 */}
          <div className="absolute inset-x-0 top-0 h-[48%]">
            <Image
              src="/landing/landing-fourth-background.svg"
              alt=""
              fill
              className="object-cover object-top"
            />
          </div>
          {/* 배경→흰색 페이드 */}
          <div className="absolute inset-x-0 top-[32%] h-[20%] bg-gradient-to-b from-transparent to-white" />

          {/* 카드 cascade - 뒤→앞 */}
          <div className="absolute bottom-[60%] left-[2%] w-[72%] rotate-[-18deg] drop-shadow-lg">
            <Image src="/landing/landing-fourth-news4.svg" alt="소식" width={480} height={260} className="w-full rounded-xl" />
          </div>
          <div className="absolute bottom-[50%] left-[5%] w-[74%] rotate-[-12deg] drop-shadow-lg">
            <Image src="/landing/landing-fourth-news3.svg" alt="소식" width={500} height={270} className="w-full rounded-xl" />
          </div>
          <div className="absolute bottom-[38%] left-[8%] w-[78%] rotate-[-6deg] drop-shadow-xl">
            <Image src="/landing/landing-fourth-news2.svg" alt="소식" width={520} height={280} className="w-full rounded-xl" />
          </div>
          <div className="absolute bottom-[26%] left-[10%] w-[82%] rotate-[-1deg] drop-shadow-2xl">
            <Image src="/landing/landing-fourth-news1.svg" alt="소식" width={550} height={300} className="w-full rounded-xl" />
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
