export interface RecommendedMember {
    nickname: string;
    profileImageUrl: string;
    isFollowing: boolean;
}

export interface RecommendResponse {
    friends: RecommendedMember[];
}

export interface UpdateProfileRequest {
    description: string;
    categories: string[];
    imgUrl?: string;
}

export interface UpdatePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface ProfileResponse {
    nickname: string;
    description: string;
    profileImageUrl: string;
    categories: string[];
}

export interface OtherProfileResponse {
    nickname: string;
    description: string;
    profileImageUrl: string;
    following: boolean;
    categories: string[];
}

export type ReportType = "GENERAL" | "CLUB_MEETING" | "BOOK_STORY" | "COMMENT";

export interface ReportMemberRequest {
    reportedMemberNickname: string;
    reportType: ReportType;
    content: string;
}

export interface FollowMember {
    nickname: string;
    profileImageUrl: string;
    following: boolean;
}

export interface FollowListResponse {
    followList: FollowMember[];
    hasNext: boolean;
    nextCursor: number | null;
}

export interface FollowCountResponse {
    followerCount: number;
    followingCount: number;
}
