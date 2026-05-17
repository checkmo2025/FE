import DesktopMockup from "./shared/DesktopMockup";

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

        <div className="w-full t:flex-1">
          <DesktopMockup variant="home" />
        </div>
      </div>
    </section>
  );
}
