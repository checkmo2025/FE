"use client";
import NotificationItem from "@/components/base-ui/Settings/Notification/NotificationItem";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useNotificationSettingsQuery } from "@/hooks/queries/useNotificationQueries";
import { useToggleNotificationMutation } from "@/hooks/mutations/useNotificationMutations";
import { NotificationSettingType } from "@/types/notification";

export default function NotificationPage() {
  const { data: settings, isLoading } = useNotificationSettingsQuery();
  const { mutate: toggleSetting, isPending } = useToggleNotificationMutation();

  const handleToggle = (settingType: NotificationSettingType) => {
    toggleSetting(settingType);
  };

  return (
    <SettingsDetailLayout
      title="알림 관리"
      className="gap-[10px] md:gap-[60px] xl:gap-[40px]"
    >
      {/* 로딩 영역 */}
      {isLoading ? (
        <div className="py-4 text-center text-Gray-4 w-full">로딩 중...</div>
      ) : (
        <>
          {/* 책모 알림 */}
          <div className="flex flex-col items-start gap-[20px] self-stretch">
            <h3 className="body_1_2 text-Gray-7">책모 알림</h3>
            <div className="flex flex-col gap-[20px] self-stretch">
              <NotificationItem
                title="책 이야기 좋아요 알림"
                description="내 책이야기 좋아요 활동에 대한 알림 수신"
                isChecked={settings?.bookStoryLiked}
                onToggle={() => handleToggle("BOOK_STORY_LIKED")}
                disabled={isPending}
              />
              <NotificationItem
                title="책 이야기 댓글 알림"
                description="내 책이야기에 작성된 댓글 활동에 대한 알림 수신"
                isChecked={settings?.bookStoryComment}
                onToggle={() => handleToggle("BOOK_STORY_COMMENT")}
                disabled={isPending}
              />
              <NotificationItem
                title="구독자 알림"
                description="내 계정 구독 활동에 대한 알림 수신"
                isChecked={settings?.newFollower}
                onToggle={() => handleToggle("NEW_FOLLOWER")}
                disabled={isPending}
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
                isChecked={settings?.joinClub}
                onToggle={() => handleToggle("JOIN_CLUB")}
                disabled={isPending}
              />
              <NotificationItem
                title="모임 공지사항 알림"
                description="참여 중인 모임의 새로운 공지사항 등록 알림 수신"
                isChecked={settings?.clubNoticeCreated}
                onToggle={() => handleToggle("CLUB_NOTICE_CREATED")}
                disabled={isPending}
              />
              <NotificationItem
                title="모임 일정 생성 알림"
                description="참여 중인 모임의 새로운 일정(모임) 생성 알림 수신"
                isChecked={settings?.clubMeetingCreated}
                onToggle={() => handleToggle("CLUB_MEETING_CREATED")}
                disabled={isPending}
              />
            </div>
          </div>
        </>
      )}
    </SettingsDetailLayout>
  );
}
