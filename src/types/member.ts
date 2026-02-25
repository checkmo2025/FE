export interface RecommendedMember {
    nickname: string;
    profileImageUrl: string;
}

export interface RecommendResponse {
    friends: RecommendedMember[];
}

export interface UpdateProfileRequest {
    nickname: string;
    description: string;
    categories: string[];
    profileImageUrl?: string;
}
