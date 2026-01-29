// src/app/profile/[nickname]/page.tsx
import Header from "@/components/layout/Header";
import Image from "next/image";
import OtherUserProfileTabs from "@/components/base-ui/MyPage/OtherUserProfileTabs";

type PageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function OtherUserProfilePage({ params }: PageProps) {
  const { nickname } = await params;

  return (
    /* Frame 2087328481 */
    <div className="flex w-full flex-col items-start gap-[80px] bg-white">
      {/* Frame 2087328480 */}
      <div className="flex flex-col items-center gap-[24px] self-stretch">
        {/* Header */}
        <Header />

        {/* 목차 */}
        <div className="flex w-[1396px] flex-col items-start gap-[10px] border-b border-[#DADADA] px-[10px] py-[12px]">
          <div className="flex items-center gap-[20px] self-stretch">
            <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#BBB]">
              전체
            </span>

            <Image
              src="/Polygon6.svg"
              alt="breadcrumb arrow"
              width={8}
              height={8}
            />

            <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#2C2C2C]">
              {nickname}
            </span>
          </div>
        </div>
      </div>

      {/* Frame 2087328479 */}
      <div className="flex flex-col items-center gap-[40px] self-stretch">
        {/* 다른 사람 프로필 소개 */}
        <div className="flex w-[734px] flex-col items-center gap-[40px]">
          <div className="flex items-center gap-[38px]">
            <div className="flex h-[138px] w-[138px] items-center justify-center">
              <Image
                src="/profile.svg"
                alt="profile image"
                width={138}
                height={138}
                className="rounded-full"
              />
            </div>

            <div className="flex w-[558px] flex-col items-center gap-[12px]">
              <div className="flex items-start self-stretch justify-between">
                <div className="flex w-[136px] flex-col items-start gap-[8px]">
                  <span className="text-[24px] font-semibold leading-[135%] tracking-[-0.024px] text-[#2C2C2C]">
                    {nickname}
                  </span>

                  <div className="flex items-center gap-[12px] self-stretch">
                    <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#8D8D8D]">
                      구독중
                    </span>
                    <span className="text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#7B6154]">
                      2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center gap-[24px] self-stretch">
            <button className="flex h-[48px] w-[532px] items-center justify-center rounded-[8px] bg-[#7B6154]">
              <span className="text-[18px] font-medium text-white">
                구독하기
              </span>
            </button>

            <button className="flex h-[48px] w-[178px] items-center justify-center rounded-[8px] border border-[#D2C5B6] bg-white">
              <span className="text-[18px] font-medium text-[#8D8D8D]">
                신고하기
              </span>
            </button>
          </div>
        </div>

        {/* 🔽 여기! 탭 영역 */}
        <OtherUserProfileTabs />
      </div>
    </div>
  );
}
