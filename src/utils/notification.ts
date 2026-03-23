import { NotificationBasicInfo } from "@/types/notification";

export const getNotificationText = (notification: NotificationBasicInfo): string => {
    const name = notification.displayName;
    switch (notification.notificationType) {
        case "LIKE":
            return `${name}님이 책이야기에 좋아요를 눌렀습니다.`;
        case "COMMENT":
            return `${name}님이 책이야기에 댓글을 달았습니다.`;
        case "FOLLOW":
            return `${name}님이 구독을 시작했어요.`;
        case "JOIN_CLUB":
            return `${name}모임 가입 성공`;
        case "CLUB_MEETING_CREATED":
            return `${name}의 새로운 정기모임을 확인해보세요`;
        case "CLUB_NOTICE_CREATED":
            return `${name}의 새로운 공지사항을 확인해보세요.`;
        default:
            return "새로운 알림이 도착했습니다.";
    }
};

export const getNotificationRedirectUrl = (notification: NotificationBasicInfo): string => {
    switch (notification.notificationType) {
        case "LIKE":
        case "COMMENT":
            return `/stories/${notification.domainId}`;
        case "FOLLOW":
            return `/profile/${encodeURIComponent(notification.displayName)}`;
        case "JOIN_CLUB":
        case "CLUB_MEETING_CREATED":
        case "CLUB_NOTICE_CREATED":
            return `/groups/${notification.domainId}`;
        default:
            return "/profile/mypage?tab=notifications";
    }
};
