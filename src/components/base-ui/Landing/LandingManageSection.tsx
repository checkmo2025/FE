import Image from "next/image";

export default function LandingManageSection() {
  return (
    <section className="overflow-hidden bg-white py-20 t:py-28">
      <div className="mx-auto max-w-[1200px] px-6 d:px-8">
        {/* 좌측 텍스트 */}
        <div className="mb-10 flex flex-col gap-4 t:w-[40%]">
          <div className="flex flex-col gap-0.5">
            <span className="subhead_3_1 font-bold text-primary-1">모임 운영</span>
            <span className="body_1_2 text-Gray-4">Club Admin</span>
          </div>
          <h2 className="subhead_1 text-Gray-7 t:headline_3">
            모임원 관리와 공지, 투표 등 운영에
            <br />
            필요한 기능을 한곳에서 이용할 수 있어요.
          </h2>
          <p className="body_1_2 leading-relaxed text-Gray-5">
            독서모임을 준비하고 운영하는 과정을 더 체계적이고
            <br />
            편리하게 이어갈 수 있어요.
          </p>
        </div>

        {/* 화면 영역 */}
        <div className="relative h-[600px]">
          {/* 폰 프레임 - 중앙 */}
          <div className="absolute left-[28%] top-0 z-20 w-[18%]">
            <div className="relative overflow-hidden rounded-[40px] border-[6px] border-Gray-7 bg-white shadow-2xl">
              <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-Gray-7" />
              <div className="pt-5">
                <Image
                  src="/landing/landing-fifth-screen.svg"
                  alt="모임 운영 모바일 화면"
                  width={280}
                  height={520}
                  className="w-full"
                />
              </div>
              <div className="flex justify-center bg-white py-2">
                <div className="h-1 w-20 rounded-full bg-Gray-3" />
              </div>
            </div>
          </div>

          {/* 데스크탑 화면들 - 오른쪽 */}
          <div className="absolute right-[-8%] top-0 z-10 w-[62%] origin-top-right scale-[0.72]">
            {/* 상단 화면 - 모임 가입 신청 관리 */}
            <div className="w-full drop-shadow-lg">
              <Image
                src="/landing/landing-fifth-screen1.svg"
                alt="모임 가입 신청 관리"
                width={720}
                height={200}
                className="w-full rounded-xl"
              />
            </div>

            {/* 하단 화면 - 투표 + screen3 오버레이 */}
            <div className="relative mt-4 w-full drop-shadow-xl">
              <Image
                src="/landing/landing-fifth-screen2.svg"
                alt="투표 화면"
                width={720}
                height={420}
                className="w-full rounded-xl"
              />
              {/* screen3 - 투표 항목 위에 오버레이 */}
              <div className="absolute -left-[8%] top-[52%] w-[75%] drop-shadow-2xl">
                <Image
                  src="/landing/landing-fifth-screen3.svg"
                  alt="투표 항목"
                  width={560}
                  height={80}
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
