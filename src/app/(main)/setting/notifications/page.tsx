import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import NotificationItem from "@/components/base-ui/Settings/Notification/NotificationItem";

export default function NotificationPage() {
  return (
    // 전체 컨테이너: w-[1152px], px-[68px]/[400px] (프로필/이메일 변경과 동일 규격)
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[314px] pl-[68px] pr-[400px]">
      {/* 1. 타이틀 영역 */}
      <SettingsTitle title="알림 관리" />

      {/* 2. 본문 영역 (w-[688px]) */}
      <div className="flex w-[688px] flex-col items-start gap-[40px] px-[20px]">
        {/* 섹션 1: 책모 알림 */}
        <div className="flex flex-col items-start gap-[20px] self-stretch">
          <h3 className="body_1_2 text-Gray-7">책모 알림</h3>

          <div className="flex flex-col gap-[20px]">
            <NotificationItem
              title="책 이야기 좋아요 알림"
              description="내 책이야기 좋아요 활동에 대한 알림 수신"
            />
            <NotificationItem
              title="책 이야기 댓글 알림"
              description="내 책이야기에 작성된 댓글 활동에 대한 알림 수신"
            />
            <NotificationItem
              title="구독자 알림"
              description="내 계정 구독 활동에 대한 알림 수신"
            />
          </div>
        </div>

        {/* 섹션 2: 독서 모임 알림 (동일한 UI 구조 반복) */}
        <div className="flex flex-col items-start gap-[20px] self-stretch">
          <h3 className="body_1_2 text-Gray-7">독서 모임 알림</h3>

          <div className="flex flex-col gap-[20px]">
            <NotificationItem
              title="독서 모임 가입 알림"
              description="나의 독서 모임 가입 활동에 대한 알림 수신"
            />
            <NotificationItem
              title="공지사항 알림"
              description="내가 가입한 독서 모임의 공지사항 등록에 대한 알림 수신"
            />
            <NotificationItem
              title="정기 모임 생성 알림"
              description="내가 가입한 독서 모임의 정기 모임 생성에 대한 알림 수신
"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
