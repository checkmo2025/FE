import Image from "next/image";

export default function LandingHomeSection() {
  return (
    <section className="bg-white py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 t:flex-row t:gap-16 d:px-8">
        <div className="flex flex-col gap-4 t:w-[40%] t:shrink-0">
          <span className="body_2_1 text-primary-2">책모 홈 / Home page</span>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            책모의 시작은 여기,
            <br />
            홈 화면에서부터
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            나의 독서모임 일정, 추천 도서, 최신 스토리까지
            <br />
            한 화면에서 모두 확인할 수 있어요.
          </p>
        </div>

        <div className="relative w-full t:flex-1">
          {/* 메인 스크린 */}
          <Image
            src="/landing-second-screen.svg"
            alt="책모 홈 화면"
            width={700}
            height={460}
            className="w-full rounded-xl shadow-xl"
          />
          {/* 캐러셀 카드 - 좌하단 플로팅 */}
          <div className="absolute -bottom-6 -left-4 w-[45%] t:-left-8">
            <Image
              src="/landing-second-carrecel.svg"
              alt="캐러셀"
              width={300}
              height={180}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          {/* 북스토리 카드 - 우하단 플로팅 */}
          <div className="absolute -bottom-4 -right-4 w-[40%] t:-right-6">
            <Image
              src="/landing-second-bookstory.svg"
              alt="북스토리"
              width={260}
              height={160}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
