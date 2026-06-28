export interface RecommendedMember {
    nickname: string;
    profileImageUrl: string;
    isFollowing: boolean;
}

export interface RecommendResponse {
    friends: RecommendedMember[];
}

export interface UpdateProfileRequest {
    nickname?: string;
    description: string;
    categories: string[];
    phoneNumber: string;
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

export interface FollowMember {
    nickname: string;
    profileImageUrl: string;
    following: boolean;
    isDeleted?: boolean;
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


export type LoginProvider = "LOCAL" | "GOOGLE" | "KAKAO" | "NAVER";

export interface LoginStatusResponse {
    provider: LoginProvider;
    email: string;
    admin?: boolean;
}

export interface BlockedUser {
    memberId: string;
    nickname: string;
    profileImageUrl: string | null;
}

export interface BlockListResponse {
    blocks: BlockedUser[];
    hasNext: boolean;
    nextCursor: number | null;
}
