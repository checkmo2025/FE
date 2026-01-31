"use client";

import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import NotificationItem from "@/components/base-ui/Settings/Notification/NotificationItem";
import MobileSettingHeader from "@/components/base-ui/Settings/MobileSettingHeader";

export default function NotificationPage() {
  return (
    // 전체 컨테이너
    <div
      className="flex flex-col items-start gap-[24px] pb-[314px]
      w-full md:w-[480px]
      xl:w-[1152px] xl:pl-[68px] xl:pr-[400px]"
    >
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col w-full">
        {/* 모바일: 뒤로가기 헤더 */}
        <MobileSettingHeader title="뒤로가기" />

        {/* 태블릿/데스크탑: 타이틀 (md 이상 block) */}
        <div className="hidden w-full md:block">
          <SettingsTitle title="알림 관리" />
        </div>

        {/* 모바일: 타이틀  */}
        <div className="md:hidden flex items-center justify-center w-full px-[20px] py-[28px] h-[40px] border-b border-Subbrown-4">
          <h2 className="text-center subhead_3 text-Gray-6">알림 관리</h2>
        </div>
      </div>

      {/* 2. 본문 영역 */}

      <div
        className="flex flex-col items-start px-[20px]
        w-full gap-[10px]
        md:w-[480px] md:gap-[60px]
        xl:w-[688px] xl:gap-[40px]"
      >
        {/* 섹션 1: 책모 알림 */}
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

        {/* 섹션 2: 독서 모임 알림 */}
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
      </div>
    </div>
  );
}
