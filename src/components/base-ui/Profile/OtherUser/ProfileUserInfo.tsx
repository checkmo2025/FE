// src/components/base-ui/Profile/ProfileUserInfo.tsx
import Image from "next/image";

export default function ProfileUserInfo({ nickname }: { nickname: string }) {
  // 공통 텍스트 스타일
  const textStyle =
    "text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#8D8D8D]";
  const numberStyle =
    "text-[18px] font-medium leading-[135%] tracking-[-0.018px] text-[#7B6154]";

  return (
    <div className="flex w-full flex-col items-center gap-[40px] md:w-[688px] xl:w-[734px]">
      <div className="flex w-full items-center gap-[38px]">
        <div className="relative flex h-[138px] w-[138px] shrink-0 items-center justify-center rounded-full border border-[#D2C5B6] bg-[#F9F7F6]">
          <Image
            src="/profile.svg"
            alt={`${nickname}님의 프로필`}
            fill
            className="object-cover rounded-full"
          />
        </div>

        <div className="flex w-full flex-col items-center gap-[12px] md:w-[512px] xl:w-[558px]">
          <div className="flex items-start self-stretch justify-between">
            <div className="flex w-full flex-col items-start gap-[8px]">
              <h1 className="text-[24px] font-semibold leading-[135%] tracking-[-0.024px] text-[#2C2C2C]">
                {nickname}
              </h1>

              <div className="flex items-center gap-[12px] self-stretch">
                <div className="flex items-center gap-[4px]">
                  <span className={textStyle}>구독중</span>
                  <span className={numberStyle}>2</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span className={textStyle}>구독자</span>
                  <span className={numberStyle}>2</span>
                </div>
              </div>
            </div>
          </div>

          <p className="self-stretch text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#8D8D8D]">
            이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을
            시작해보세요. 한 권의 책이 주는 작은 울림이 일상에 큰 변화를
            가져올지도 모릅니다. 여러분의 이야기가 이 모임을 더욱 풍성하게
            만들어줄 거예요.제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한
            시간을 시작해보세요. 한 권의 책이 주는 작은 울림
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[24px] self-stretch">
        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#EAE5E2] transition-colors md:w-[486px] xl:w-[532px] xl:bg-[#7B6154]"
        >
          <span className="text-[18px] font-medium text-[#5E4A40] xl:text-white">
            구독 중
          </span>
        </button>

        <button
          type="button"
          className="flex h-[48px] w-[178px] shrink-0 items-center justify-center rounded-[8px] border border-[#D2C5B6] bg-white transition-colors hover:bg-gray-50"
        >
          <span className="text-[18px] font-medium text-[#8D8D8D]">
            신고하기
          </span>
        </button>
      </div>
    </div>
  );
}
