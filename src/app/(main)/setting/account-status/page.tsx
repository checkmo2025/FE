import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";
import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import SocialLoginCard from "@/components/base-ui/Settings/SocialLogin/SocialLoginCard";
import WithdrawalNotice from "@/components/base-ui/Settings/SocialLogin/WithdrawalNotice";

export default function AccountStatusPage() {
  return (
    // 전체 컨테이너
    <div
      className="flex flex-col items-start gap-[60px] md:gap-[120px] pb-[266px]
      w-full md:w-[480px]
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 (소셜 로그인 섹션 포함) */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <div className="flex flex-col w-full">
          {/* 모바일: 뒤로가기 헤더 */}
          <MobileSettingHeader title="뒤로가기" />

          <SettingsTitle title="소셜 로그인 연동 관리" />
        </div>

        <div className="px-[20px] w-full flex justify-center md:block">
          {/* SocialLoginCard는 내부적으로 w-[420px] 고정이므로 모바일(375px)에서 넘칠 수 있음.
              모바일 대응을 위해 SocialLoginCard 내부 수정이 필요할 수 있으나, 
              현재는 w-full max-w-[420px] 등으로 감싸거나 스크롤 처리.
              여기서는 flex justify-center로 중앙 배치하되, 카드 너비가 화면보다 크면 잘릴 수 있음.
              -> SocialLoginCard를 w-full로 반응형 수정하는 것이 좋음. (아래 참고)
           */}
          <SocialLoginCard provider="kakao" email="yhi9839@gmail.com" />
        </div>
      </div>

      {/* 2. 탈퇴/비활성화 섹션 */}
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        <SettingsTitle title="탈퇴/비활성화" />

        <div
          className="flex flex-col items-start gap-[40px] px-[20px]
          w-full md:w-[480px]
          xl:w-[1000px]"
        >
          <WithdrawalNotice />

          <div
            className="flex w-full pt-[10px]
            justify-center xl:justify-end"
          >
            <button
              className="flex items-center justify-center gap-[10px] rounded-[8px] transition-colors
               
               /* 모바일(기본): w-[339px](w-full), h-[40px], bg-[#3D3D3D] */
               w-full h-[40px] bg-[#3D3D3D]

               /* 태블릿(md): w-[420px] (기존 유지) */
               md:w-[420px]

               /* 데스크탑(xl): w-[200px], h-[48px], bg-Subbrown-4 */
               xl:w-[200px] xl:h-[48px] xl:bg-Subbrown-4 xl:hover:bg-Subbrown-3"
            >
              <span className=" subhead_4_1 text-White xl:body_1 xl:text-primary-3">
                탈퇴하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
