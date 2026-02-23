import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import { RecommendResponse } from "@/types/member";
import { ApiResponse } from "@/types/auth";

export const memberService = {
    getRecommendedMembers: async (): Promise<RecommendResponse | undefined> => {
        try {
            const response = await apiClient.get<ApiResponse<RecommendResponse>>(
                MEMBER_ENDPOINTS.RECOMMEND
            );
            if (response.isSuccess) {
                return response.result;
            }
        } catch (error) {
            console.error("Failed to fetch recommended members:", error);
        }
        return undefined;
    },
};
