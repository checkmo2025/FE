import MobileMockup from "./shared/MobileMockup";

export default function LandingManageSection() {
  return (
    <section className="bg-white py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 t:flex-row t:gap-16 d:px-8">
        <div className="flex flex-col gap-4 t:w-[40%] t:shrink-0">
          <span className="body_2_1 text-primary-2">모임 운영</span>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            모임원 관리와 공지, 투표 등 운영에
            <br />
            필요한 기능을 한곳에서 이용할 수 있어요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            독서모임 리더라면 꼭 필요한 모든 관리 기능을
            <br />
            책모 한 곳에서 편리하게 사용하세요.
          </p>
        </div>

        <div className="flex w-full items-center justify-center t:flex-1">
          <MobileMockup />
        </div>
      </div>
    </section>
  );
}
