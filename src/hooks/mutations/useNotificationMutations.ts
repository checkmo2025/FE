import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { NotificationSettingType, NotificationBasicInfo, NotificationListResponse } from "@/types/notification";
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
        onMutate: async (notificationId: number) => {
            // Cancel outgoing refetches for notifications
            await queryClient.cancelQueries({ queryKey: notificationKeys.all });

            // Snapshot the previous values (optional)
            const previousData = queryClient.getQueryData(notificationKeys.all);

            // 1. Update Preview Queries (matches any size parameter)
            queryClient.setQueriesData<NotificationBasicInfo[]>(
                { queryKey: [...notificationKeys.all, "preview"] }, // Prefix match
                (old) => old?.map(n => n.notificationId === notificationId ? { ...n, read: true } : n)
            );

            // 2. Update Infinite List Queries
            queryClient.setQueriesData<InfiniteData<NotificationListResponse>>(
                { queryKey: notificationKeys.infiniteList() },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            notifications: page.notifications.map(n =>
                                n.notificationId === notificationId ? { ...n, read: true } : n
                            )
                        }))
                    };
                }
            );

            return { previousData };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
};
