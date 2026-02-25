import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { NotificationSettingType } from "@/types/notification";
import { notificationKeys } from "../queries/useNotificationQueries";
import toast from "react-hot-toast";

export const useToggleNotificationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settingType: NotificationSettingType) => {
            await notificationService.updateSetting(settingType);
        },
        onSuccess: () => {
            // Invalidate the settings query to refetch fresh data
            queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
        },
        onError: (error: any) => {
            toast.error(error.message || "알림 설정 변경에 실패했습니다.");
        },
    });
};

export const useReadNotificationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => notificationService.readNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.infiniteList() });
        },
    });
};
