import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import { RecommendResponse, UpdateProfileRequest, UpdatePasswordRequest, ProfileResponse, OtherProfileResponse } from "@/types/member";
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
    updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
        const response = await apiClient.patch<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.UPDATE_PASSWORD,
            data
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to update password");
        }
    },
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await apiClient.get<ApiResponse<ProfileResponse>>(
            MEMBER_ENDPOINTS.GET_PROFILE
        );
        return response.result!;
    },
    getOtherProfile: async (nickname: string): Promise<OtherProfileResponse> => {
        const response = await apiClient.get<ApiResponse<OtherProfileResponse>>(
            MEMBER_ENDPOINTS.GET_OTHER_PROFILE(nickname)
        );
        return response.result!;
    },
};
