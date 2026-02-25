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
