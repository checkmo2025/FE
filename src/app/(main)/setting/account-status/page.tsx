// src/app/(main)/settings/account-status/page.tsx
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SocialLoginCard from "@/components/base-ui/Settings/SocialLogin/SocialLoginCard";
import WithdrawalNotice from "@/components/base-ui/Settings/SocialLogin/WithdrawalNotice";

export default function AccountStatusPage() {
  return (
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[266px] pl-[68px] pr-[400px]">
      {/* 섹션 1: 소셜 로그인 연동 관리 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <SettingsTitle title="소셜 로그인 연동 관리" />

        {/* 소셜 로그인 카드 리스트 */}
        <div className="px-[20px]">
          <SocialLoginCard provider="kakao" email="yhi9839@gmail.com" />
        </div>
      </div>

      {/* 섹션 2: 탈퇴/비활성화 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <SettingsTitle title="탈퇴/비활성화" />

        {/* 안내문 본문 */}
        <div className="flex w-[1000px] flex-col items-start gap-[120px] px-[20px]">
          <WithdrawalNotice />

          {/* 탈퇴 버튼 영역 (우측 정렬을 위해 flex-end 적용) */}
          <div className="flex w-full justify-end pt-[10px]">
            <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-Subbrown-4 px-[16px] py-[12px] hover:bg-Subbrown-3 transition-colors">
              <span className="body_1 text-primary-3">탈퇴하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
