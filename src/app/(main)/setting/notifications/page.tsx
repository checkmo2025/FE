"use client";
import NotificationItem from "@/components/base-ui/Settings/Notification/NotificationItem";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export default function NotificationPage() {
  return (
    <SettingsDetailLayout
      title="알림 관리"
      className="gap-[10px] md:gap-[60px] xl:gap-[40px]"
    >
      {/* 책모 알림 */}
      <div className="flex flex-col items-start gap-[20px] self-stretch">
        <h3 className="body_1_2 text-Gray-7">책모 알림</h3>
        <div className="flex flex-col gap-[20px] self-stretch">
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

      {/* 독서 모임 알림 */}
      <div className="flex flex-col items-start gap-[20px] self-stretch">
        <h3 className="body_1_2 text-Gray-7">독서 모임 알림</h3>
        <div className="flex flex-col gap-[20px] self-stretch">
          <NotificationItem
            title="모임 참여 신청/승인 알림"
            description="모임 참여 신청 및 승인 결과에 대한 알림 수신"
          />
          <NotificationItem
            title="모임 공지사항 알림"
            description="참여 중인 모임의 새로운 공지사항 등록 알림 수신"
          />
          <NotificationItem
            title="모임 댓글/답글 알림"
            description="작성한 게시글에 대한 댓글 및 답글 알림 수신"
          />
        </div>
      </div>
    </SettingsDetailLayout>
  );
}
