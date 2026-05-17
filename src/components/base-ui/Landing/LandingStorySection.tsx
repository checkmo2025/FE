import DesktopMockup from "./shared/DesktopMockup";

export default function LandingStorySection() {
  return (
    <section className="bg-white py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 t:flex-row t:gap-16 d:px-8">
        <div className="flex flex-col gap-4 t:w-[40%] t:shrink-0">
          <span className="body_2_1 text-primary-2">책 이야기 / Book Story</span>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            읽은 책이 있다면,
            <br />
            당신의 이야기를 들려주세요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            스토리, 리뷰, 감상문 어떤 형태로든
            <br />
            책에 대한 이야기를 자유롭게 나눌 수 있어요.
          </p>
        </div>

        <div className="w-full t:flex-1">
          <DesktopMockup variant="story" />
        </div>
      </div>
    </section>
  );
}
