import Image from "next/image";

export default function LandingStorySection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 t:flex-row t:items-start t:gap-16 d:px-8">
        {/* 텍스트 */}
        <div className="flex flex-col gap-4 t:w-[38%] t:shrink-0 t:pt-10">
          <div className="flex flex-col gap-0.5">
            <span className="subhead_3_1 font-bold text-primary-1">책 이야기</span>
            <span className="body_1_2 text-Gray-4">Book Story</span>
          </div>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            읽은 책이 있다면,
            <br />
            당신의 이야기를 들려주세요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            좋아요, 댓글, 구독을 통해 생각이 연결되는 경험을 할 수 있어요.
          </p>
        </div>

        {/* 스크린 + 책 데코 */}
        <div className="relative w-full t:flex-1">
          <Image
            src="/landing/landing-fourth-screen.svg"
            alt="책 이야기 화면"
            width={700}
            height={460}
            className="w-full rounded-xl shadow-xl"
          />
          {/* 책 스택 데코 - 우하단 */}
          <div className="absolute -bottom-10 -right-8 w-[30%] t:-right-12">
            <Image
              src="/landing/landing-fourth-books.svg"
              alt=""
              width={220}
              height={200}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
