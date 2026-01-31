import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SocialLoginCard from "@/components/base-ui/Settings/SocialLogin/SocialLoginCard";
import WithdrawalNotice from "@/components/base-ui/Settings/SocialLogin/WithdrawalNotice";

export default function AccountStatusPage() {
  return (
    // 전체 컨테이너

    <div
      className="flex flex-col items-start pb-[266px]
      w-full md:w-[480px] md:px-0
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 섹션 1: 소셜 로그인 연동 관리 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <SettingsTitle title="소셜 로그인 연동 관리" />

        {/* 카드 영역 */}
        <div className="px-[20px]">
          {/* SocialLoginCard는 w-[420px]로 고정되어 있어 480px 컨테이너 안에 잘 맞습니다. */}
          <SocialLoginCard provider="kakao" email="yhi9839@gmail.com" />
        </div>
      </div>

      {/* 섹션 2: 탈퇴/비활성화 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <SettingsTitle title="탈퇴/비활성화" />

        {/* 안내문 본문 */}

        <div
          className="flex flex-col items-start gap-[40px] px-[20px]
          w-full md:w-[480px]
          xl:w-[1000px]"
        >
          <WithdrawalNotice />

          {/* 탈퇴 버튼 영역 */}
          <div
            className="flex w-full pt-[10px]
            justify-center xl:justify-end"
          >
            <button
              className="flex items-center justify-center gap-[10px] rounded-[8px] transition-colors
               
               /* 태블릿(md) 스타일: w-[420px], h-[40px], bg-[#3D3D3D] (Dark Gray), Text White */
               md:w-[420px] md:h-[40px] md:bg-[#3D3D3D]
               
               /* 데스크탑(xl) 스타일: w-[200px], h-[48px], bg-Subbrown-4, Text Primary-3 */
               xl:w-[200px] xl:h-[48px] xl:bg-Subbrown-4 xl:hover:bg-Subbrown-3"
            >
              {/* 텍스트 스타일 분기 */}
              <span className=" md:subhead_4_1 md:text-White xl:body_1 xl:text-primary-3">
                탈퇴하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
