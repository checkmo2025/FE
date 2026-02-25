import { apiClient } from "@/lib/api/client";
import { NOTIFICATION_ENDPOINTS } from "@/lib/api/endpoints/notification";
import { NotificationSettings, NotificationSettingType, NotificationListResponse } from "@/types/notification";
import { ApiResponse } from "@/types/auth";

export const notificationService = {
    getSettings: async (): Promise<NotificationSettings> => {
        const response = await apiClient.get<ApiResponse<NotificationSettings>>(
            NOTIFICATION_ENDPOINTS.GET_SETTINGS
        );
        return response.result!;
    },
    updateSetting: async (settingType: NotificationSettingType): Promise<void> => {
        const response = await apiClient.patch<ApiResponse<unknown>>(
            NOTIFICATION_ENDPOINTS.UPDATE_SETTING(settingType)
        );
        if (!response.isSuccess) {
            throw new Error(response.message || "Failed to update notification setting");
        }
    },
    getNotifications: async (cursorId?: number): Promise<NotificationListResponse> => {
        const url = new URL(NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS);
        if (cursorId) {
            url.searchParams.append("cursorId", cursorId.toString());
        }

        const response = await apiClient.get<ApiResponse<NotificationListResponse>>(
            url.toString()
        );
        return response.result!;
    },
};
