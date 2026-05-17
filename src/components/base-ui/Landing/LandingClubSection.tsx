import Image from "next/image";

export default function LandingClubSection() {
  return (
    <section className="relative overflow-hidden py-20 t:py-32">
      {/* 배경 */}
      <Image
        src="/landing/landing-third-backgroud.svg"
        alt=""
        fill
        className="object-cover"
      />

      {/* 플로팅 카드 */}
      <div className="pointer-events-none absolute inset-0">
        {/* 좌상단 */}
        <div className="absolute left-[-8%] top-[38%] w-[18%] rotate-[-22deg] t:left-[-6%] t:w-[22%]">
          <Image src="/landing/landing-third-club1.svg" alt="" width={300} height={180} className="w-full" />
        </div>
        {/* 좌중단 */}
        <div className="absolute left-[-4%] top-[60%] w-[16%] rotate-[-12deg] t:left-[-2%] t:w-[20%]">
          <Image src="/landing/landing-third-club2.svg" alt="" width={280} height={160} className="w-full" />
        </div>
        {/* 우상단 */}
        <div className="absolute right-[-8%] top-[38%] w-[18%] rotate-[18deg] t:right-[-6%] t:w-[22%]">
          <Image src="/landing/landing-third-club3.svg" alt="" width={300} height={180} className="w-full" />
        </div>
        {/* 우중단 */}
        <div className="absolute right-[-4%] top-[60%] w-[16%] rotate-[12deg] t:right-[-2%] t:w-[20%]">
          <Image src="/landing/landing-third-club4.svg" alt="" width={280} height={160} className="w-full" />
        </div>
        {/* 하단 좌 */}
        <div className="absolute bottom-[-6%] left-[10%] w-[16%] rotate-[-8deg] t:w-[20%]">
          <Image src="/landing/landing-third-club2.svg" alt="" width={280} height={160} className="w-full" />
        </div>
        {/* 하단 우 */}
        <div className="absolute bottom-[-6%] right-[10%] w-[16%] rotate-[6deg] t:w-[20%]">
          <Image src="/landing/landing-third-club3.svg" alt="" width={280} height={160} className="w-full" />
        </div>
      </div>

      {/* 텍스트 + 메인 스크린 */}
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 t:gap-10 t:px-6 d:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col items-center gap-0.5">
            <span className="subhead_2 font-bold text-primary-1">독서 모임</span>
            <span className="body_1_2 text-Gray-4">Club</span>
          </div>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            다양한 독서모임에 직접 참여하거나,
            <br />
            원하는 독서모임을 직접 만들 수 있어요.
          </h2>
          <p className="body_1_2 text-Gray-5">
            카테고리와 지역별로 다양한 모임을 둘러보며, 나에게 맞는 독서모임을 찾아볼 수 있어요.
          </p>
        </div>

        {/* 메인 스크린 */}
        <div className="relative z-20 mx-auto w-[90%] t:w-[76%]">
          <Image
            src="/landing/landing-third-screen.svg"
            alt="독서 모임 화면"
            width={900}
            height={580}
            className="w-full rounded-xl shadow-2xl"
          />
          {/* 생성 버튼 오버레이 */}
          <div className="absolute -left-[4%] top-[20%] w-[26%] t:-left-[6%] t:w-[30%]">
            <Image src="/landing/landing-third-create-button.svg" alt="모임 생성하기" width={260} height={60} className="w-full" />
          </div>
          {/* 가입하기 버튼 오버레이 */}
          <div className="absolute -right-[4%] top-[38%] w-[18%] t:-right-[6%] t:w-[22%]">
            <Image src="/landing/landing-third-join-button.svg" alt="가입하기" width={180} height={52} className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
