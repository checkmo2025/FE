import { apiClient } from "@/lib/api/client";
import { MEMBER_ENDPOINTS } from "@/lib/api/endpoints/member";
import { RecommendResponse, UpdateProfileRequest, UpdatePasswordRequest, ProfileResponse, OtherProfileResponse, FollowListResponse, FollowCountResponse, FindEmailRequest, FindEmailResponse, LoginStatusResponse, UpdateEmailRequest, BlockListResponse } from "@/types/member";
import { ReportRequest, MyReportList } from "@/types/report";
import { ApiResponse, TermsResponse, MemberTermsStatus, UpdateAgreementsRequest } from "@/types/auth";
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
    updateEmail: async (data: UpdateEmailRequest): Promise<void> => {
        const response = await apiClient.patch<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.UPDATE_EMAIL,
            data
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "이메일 변경에 실패했습니다.");
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
    followMember: async (nickname: string): Promise<void> => {
        const response = await apiClient.post<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.FOLLOW(nickname)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to follow member");
        }
    },
    unfollowMember: async (nickname: string): Promise<void> => {
        const response = await apiClient.delete<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.FOLLOW(nickname)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to unfollow member");
        }
    },
    deleteFollower: async (nickname: string): Promise<void> => {
        const response = await apiClient.delete<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.DELETE_FOLLOWER(nickname)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to delete follower");
        }
    },
    reportMember: async (data: ReportRequest): Promise<void> => {
        const response = await apiClient.post<ApiResponse<number>>(
            MEMBER_ENDPOINTS.REPORT,
            data
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to report member");
        }
    },
    getFollowerList: async (nickname?: string, cursorId?: number): Promise<FollowListResponse> => {
        const endpoint = nickname ? MEMBER_ENDPOINTS.GET_OTHER_FOLLOWERS(nickname) : MEMBER_ENDPOINTS.GET_FOLLOWERS;
        const params = new URLSearchParams();
        if (cursorId) {
            params.append("cursorId", cursorId.toString());
        }
        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const response = await apiClient.get<ApiResponse<FollowListResponse>>(url);
        if (!response.isSuccess) {
            throw new Error(response.message || "구독자 목록을 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    getFollowingList: async (nickname?: string, cursorId?: number): Promise<FollowListResponse> => {
        const endpoint = nickname ? MEMBER_ENDPOINTS.GET_OTHER_FOLLOWINGS(nickname) : MEMBER_ENDPOINTS.GET_FOLLOWINGS;
        const params = new URLSearchParams();
        if (cursorId) {
            params.append("cursorId", cursorId.toString());
        }
        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const response = await apiClient.get<ApiResponse<FollowListResponse>>(url);
        if (!response.isSuccess) {
            throw new Error(response.message || "구독중 목록을 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    getMyFollowCount: async (): Promise<FollowCountResponse> => {
        const response = await apiClient.get<ApiResponse<FollowCountResponse>>(
            MEMBER_ENDPOINTS.GET_FOLLOW_COUNT
        );
        return response.result!;
    },
    findEmail: async (data: FindEmailRequest): Promise<FindEmailResponse> => {
        const response = await apiClient.post<ApiResponse<FindEmailResponse>>(
            MEMBER_ENDPOINTS.FIND_EMAIL,
            data
        );
        if (!response.isSuccess) {
            // Throw the exact error message from backend
            throw new Error(response.message || "해당 회원을 찾을 수 없습니다.");
        }
        return response.result!;
    },
    getMyReports: async (cursorId?: number): Promise<MyReportList> => {
        const endpoint = MEMBER_ENDPOINTS.GET_MY_REPORTS;
        const params = new URLSearchParams();
        if (cursorId) {
            params.append("cursorId", cursorId.toString());
        }
        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const response = await apiClient.get<ApiResponse<MyReportList>>(url);
        if (!response.isSuccess) {
            throw new Error(response.message || "신고 내역을 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    withdraw: async (): Promise<void> => {
        const response = await apiClient.post<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.WITHDRAWAL
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "회원 탈퇴에 실패했습니다.");
        }
    },
    getLoginStatus: async (): Promise<LoginStatusResponse> => {
        const response = await apiClient.get<ApiResponse<LoginStatusResponse>>(
            MEMBER_ENDPOINTS.GET_LOGIN_STATUS
        );
        return response.result!;
    },
    blockMember: async (nickname: string): Promise<void> => {
        const response = await apiClient.post<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.BLOCK(nickname)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "차단에 실패했습니다.");
        }
    },
    unblockMember: async (nickname: string): Promise<void> => {
        const response = await apiClient.delete<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.BLOCK(nickname)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "차단 해제에 실패했습니다.");
        }
    },
    getBlockedList: async (cursorId?: number): Promise<BlockListResponse> => {
        const endpoint = MEMBER_ENDPOINTS.GET_MY_BLOCKS;
        const params = new URLSearchParams();
        if (cursorId) {
            params.append("cursorId", cursorId.toString());
        }
        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const response = await apiClient.get<ApiResponse<BlockListResponse>>(url);
        if (!response.isSuccess) {
            throw new Error(response.message || "차단 목록을 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    getTerms: async (): Promise<TermsResponse> => {
        const response = await apiClient.get<ApiResponse<TermsResponse>>(
            MEMBER_ENDPOINTS.TERMS
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "약관을 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    getMyTerms: async (): Promise<MemberTermsStatus> => {
        const response = await apiClient.get<ApiResponse<MemberTermsStatus>>(
            MEMBER_ENDPOINTS.MY_TERMS
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "내 약관 동의 상태를 불러오는 데 실패했습니다.");
        }
        return response.result!;
    },
    saveMyTerms: async (data: UpdateAgreementsRequest): Promise<void> => {
        const response = await apiClient.post<ApiResponse<unknown>>(
            MEMBER_ENDPOINTS.MY_TERMS,
            data
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "약관 동의 상태를 저장하는 데 실패했습니다.");
        }
    },
};
