import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SocialLoginCard from "@/components/base-ui/Settings/SocialLogin/SocialLoginCard";
import WithdrawalNotice from "@/components/base-ui/Settings/SocialLogin/WithdrawalNotice";

export default function AccountStatusPage() {
  return (
    <SettingsDetailLayout
      title="소셜 로그인 연동 관리"
      mode="wide"
      className="md:gap-[120px]"
    >
      {/* 1. 소셜 로그인 카드 */}
      <div className="flex justify-center w-full md:block">
        <SocialLoginCard provider="kakao" email="yhi9839@gmail.com" />
      </div>

      {/* 2. 탈퇴/비활성화 섹션 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch w-full">
        {/* 두 번째 타이틀 수동 렌더링 */}
        <div className="-mx-[20px] md:mx-0 w-[calc(100%+40px)] md:w-full">
          <SettingsTitle title="탈퇴/비활성화" />
        </div>

        <div className="flex flex-col items-start gap-[40px] w-full xl:w-[1000px] px-[20px] md:px-0">
          <WithdrawalNotice />

          <div className="flex w-full pt-[10px] justify-center xl:justify-end">
            <button
              className="flex items-center justify-center gap-[10px] rounded-[8px] transition-colors
               w-full h-[40px] bg-[#3D3D3D]
               md:w-[420px]
               xl:w-[200px] xl:h-[48px] xl:bg-Subbrown-4 xl:hover:bg-Subbrown-3"
            >
              <span className="subhead_4_1 text-White xl:body_1 xl:text-primary-3">
                탈퇴하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </SettingsDetailLayout>
  );
}
