export interface RecommendedMember {
    nickname: string;
    profileImageUrl: string;
}

export interface RecommendResponse {
    friends: RecommendedMember[];
}
