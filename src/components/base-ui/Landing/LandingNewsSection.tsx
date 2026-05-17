import DesktopMockup from "./shared/DesktopMockup";

export default function LandingNewsSection() {
  return (
    <section className="bg-background py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 t:flex-row-reverse t:gap-16 d:px-8">
        <div className="flex flex-col gap-4 t:w-[40%] t:shrink-0">
          <span className="body_2_1 text-primary-2">소식 / News</span>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            책과 관련한 행사, 전시, 프로그램
            <br />
            소식을 한 곳에서 확인할 수 있어요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            북페어, 작가와의 만남, 도서관 프로그램 등
            <br />
            다양한 문화 행사 소식을 빠르게 받아보세요.
          </p>
        </div>

        <div className="w-full t:flex-1">
          <DesktopMockup variant="news" />
        </div>
      </div>
    </section>
  );
}
