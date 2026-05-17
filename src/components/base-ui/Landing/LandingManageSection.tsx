import Image from "next/image";

export default function LandingManageSection() {
  return (
    <section className="overflow-hidden bg-white py-20 t:py-28">
      <div className="mx-auto max-w-[1200px] px-4 t:px-6 d:px-8">
        {/* 텍스트 */}
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

        {/* 모바일 레이아웃 */}
        <div className="flex flex-col gap-6 t:hidden">
          {/* 폰 */}
          <div className="mx-auto w-[55%]">
            <div className="relative overflow-hidden rounded-[36px] border-[5px] border-Gray-7 bg-white shadow-2xl">
              <div className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-Gray-7" />
              <div className="pt-4">
                <Image
                  src="/landing/landing-fifth-screen.svg"
                  alt="모임 운영 모바일 화면"
                  width={280}
                  height={520}
                  className="w-full"
                />
              </div>
              <div className="flex justify-center bg-white py-2">
                <div className="h-1 w-16 rounded-full bg-Gray-3" />
              </div>
            </div>
          </div>
          {/* 데스크탑 화면 */}
          <div className="flex flex-col gap-4">
            <Image
              src="/landing/landing-fifth-screen1.svg"
              alt="모임 가입 신청 관리"
              width={720}
              height={200}
              className="w-full rounded-xl shadow-md"
            />
            <div className="relative">
              <Image
                src="/landing/landing-fifth-screen2.svg"
                alt="투표 화면"
                width={720}
                height={420}
                className="w-full rounded-xl shadow-md"
              />
              <div className="absolute left-0 top-[65%] w-[72%] drop-shadow-xl">
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

        {/* 태블릿+ 레이아웃 */}
        <div className="relative hidden h-[600px] t:block">
          {/* 폰 프레임 - 중앙 */}
          <div className="absolute left-[28%] z-20 w-[18%]" style={{ top: "-120px" }}>
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
          <div className="absolute right-[4%] z-10 w-[62%] origin-top-right scale-[0.72]" style={{ top: "-260px" }}>
            <div className="w-full drop-shadow-lg">
              <Image
                src="/landing/landing-fifth-screen1.svg"
                alt="모임 가입 신청 관리"
                width={720}
                height={200}
                className="w-full rounded-xl"
              />
            </div>
            <div className="relative mt-4 w-full drop-shadow-xl">
              <Image
                src="/landing/landing-fifth-screen2.svg"
                alt="투표 화면"
                width={720}
                height={420}
                className="w-full rounded-xl"
              />
              <div className="absolute -left-[8%] top-[65%] w-[75%] drop-shadow-2xl">
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
