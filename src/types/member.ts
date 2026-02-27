export interface RecommendedMember {
    nickname: string;
    profileImageUrl: string;
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
