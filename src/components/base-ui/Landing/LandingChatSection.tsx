import Image from "next/image";

export default function LandingChatSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a1008]">
      {/* 배경 이미지 */}
      <Image
        src="/landing/landing-seventh-background.svg"
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-10 t:pt-24 t:pb-16 d:px-8">
        {/* 책 아이콘 */}
        <div className="mb-6 w-24 t:w-28">
          <Image
            src="/landing/landing-seventh-book.svg"
            alt="책"
            width={120}
            height={100}
            className="w-full"
          />
        </div>

        {/* 타이틀 */}
        <h2 className="subhead_1 mb-3 text-center text-white t:headline_3">
          독서 토론의 처음부터 끝까지!
        </h2>
        <p className="body_1_2 mb-16 text-center text-white/70">
          독서 토론의 처음부터 끝까지, 함께 읽는 경험을 더 풍부하게 만들어줘요.
        </p>

        {/* 화면 영역 */}
        <div className="relative mx-auto w-full max-w-[1100px]">
          {/* 좌측 앱 화면 (screen1) */}
          <div className="relative z-10 w-[52%] drop-shadow-2xl">
            <Image
              src="/landing/landing-seventh-screen1.svg"
              alt="책모 화면"
              width={600}
              height={400}
              className="w-full rounded-xl"
            />
          </div>

          {/* 우측 팝업 화면 (screen2) - 좌측 화면과 겹치게 */}
          <div className="absolute right-0 top-[-20px] z-20 w-[62%] drop-shadow-2xl">
            <Image
              src="/landing/landing-seventh-screen2.svg"
              alt="한줄평 팝업"
              width={700}
              height={520}
              className="w-full rounded-xl"
            />
          </div>

          {/* 하단 좌측 텍스트 */}
          <div className="mt-8 w-[40%]">
            <h3 className="subhead_2 mb-2 text-white">한줄평 작성</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              책을 읽고 난 첫 감상을 별점과 함께 짧게 남겨보세요.
              <br />
              서로의 한줄평을 통해 같은 책을 다르게 읽은 시선을
              <br />
              발견할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
