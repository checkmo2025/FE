import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import { RecommendResponse, UpdateProfileRequest } from "@/types/member";
import { ApiResponse } from "@/types/auth";

export const memberService = {
    getRecommendedMembers: async (): Promise<RecommendResponse> => {
        const response = await apiClient.get<ApiResponse<RecommendResponse>>(
            MEMBER_ENDPOINTS.RECOMMEND
        );
        return response.result!;
    },
    updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
        const response = await apiClient.patch<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.UPDATE_PROFILE,
            data
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to update profile");
        }
    },
};
