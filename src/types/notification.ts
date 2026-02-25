export type NotificationSettingType =
    | "BOOK_STORY_LIKED"
    | "BOOK_STORY_COMMENT"
    | "CLUB_NOTICE_CREATED"
    | "CLUB_MEETING_CREATED"
    | "NEW_FOLLOWER"
    | "JOIN_CLUB";

export interface NotificationSettings {
    bookStoryLiked: boolean;
    bookStoryComment: boolean;
    clubNoticeCreated: boolean;
    clubMeetingCreated: boolean;
    newFollower: boolean;
    joinClub: boolean;
}

export interface NotificationBasicInfo {
    notificationId: number;
    notificationType: "LIKE" | "COMMENT" | "FOLLOW" | "JOIN_CLUB" | "CLUB_MEETING_CREATED" | "CLUB_NOTICE_CREATED";
    domainId: number;
    sourceId: number;
    displayName: string;
    read: boolean;
    createdAt: string;
}

export interface NotificationListResponse {
    notifications: NotificationBasicInfo[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}
