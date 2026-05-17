import Image from "next/image";

export default function LandingHomeSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 t:py-28">
      {/* 좌측 다크 패널 (대각선 클립) */}
      <div
        className="absolute inset-y-0 left-0 w-[48%]"
        style={{
          backgroundColor: "#3C2A22",
          clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-12 px-6 t:flex-row t:items-center t:gap-10 d:px-8">
        {/* 텍스트 (다크 패널 위) */}
        <div className="flex flex-col gap-4 t:w-[38%] t:shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="subhead_3_1 font-bold text-white">책모 홈</span>
            <span className="body_1_2 text-Subbrown-3">Main page</span>
          </div>
          <h2 className="subhead_1 text-white t:headline_3">
            책모의 시작은 여기,
            <br />
            홈 화면에서부터!
          </h2>
          <p className="body_1_2 leading-relaxed text-white/70">
            내가 참여한 모임과 최근 책 이야기,
            <br />
            소식을 한눈에 확인할 수 있어요.
          </p>
        </div>

        {/* 이미지 영역 */}
        <div className="relative w-full pb-16 t:flex-1">
          {/* 메인 스크린 */}
          <Image
            src="/landing-second-screen.svg"
            alt="책모 홈 화면"
            width={720}
            height={460}
            className="w-full rounded-xl shadow-2xl"
          />
          {/* 북스토리 카드 - 좌 플로팅 */}
          <div className="absolute -left-4 bottom-4 w-[48%] t:-left-6">
            <Image
              src="/landing-second-bookstory.svg"
              alt="북스토리"
              width={340}
              height={220}
              className="w-full rounded-xl shadow-xl"
            />
          </div>
          {/* 캐러셀 카드 - 우하단 플로팅 */}
          <div className="absolute -bottom-10 -right-2 w-[52%] t:-right-4">
            <Image
              src="/landing-second-carousel.svg"
              alt="캐러셀"
              width={380}
              height={240}
              className="w-full rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
