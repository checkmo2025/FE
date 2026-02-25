import { apiClient } from "@/lib/api/client";
import { CLUB_ENDPOINTS } from "@/lib/api/endpoints/club";
import { MyClubListResponse } from "@/types/club";
import { ApiResponse } from "@/types/auth";

export const clubService = {
    getMyClubs: async (): Promise<MyClubListResponse> => {
        const response = await apiClient.get<ApiResponse<MyClubListResponse>>(
            CLUB_ENDPOINTS.MY_CLUBS
        );
        return response.result!;
    },
};
