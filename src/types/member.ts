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
