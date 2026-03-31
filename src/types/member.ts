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

export interface UpdateEmailRequest {
    currentEmail: string;
    newEmail: string;
    verificationCode: string;
}

export interface UpdatePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface ProfileResponse {
    nickname: string;
    name: string;
    phoneNumber: string;
    description: string;
    profileImageUrl: string;
    categories: string[];
}

export interface OtherProfileResponse {
    nickname: string;
    description: string;
    profileImageUrl: string;
    following: boolean;
    followerCount: number;
    followingCount: number;
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

export interface FindEmailRequest {
    name: string;
    phoneNumber: string;
}

export interface FindEmailResponse {
    email: string;
}

export interface ReportItemData {
    reportedMemberNickname: string;
    reportedMemberProfileImageUrl: string;
    reportType: string;
    content: string;
    reportDate: string;
}

export interface ReportListResponse {
    reports: ReportItemData[];
    hasNext: boolean;
    nextCursor: number | null;
}

export type LoginProvider = "LOCAL" | "GOOGLE" | "KAKAO" | "NAVER";

export interface LoginStatusResponse {
    provider: LoginProvider;
    email: string;
}
